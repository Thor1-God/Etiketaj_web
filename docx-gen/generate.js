#!/usr/bin/env node
/**
 * Exhibition label generator
 * Usage: node generate.js <input.json> <output.docx>
 *
 * Label format (per painting):
 *   Фамилия Имя Отчество (год рождения–год смерти)   bold 14pt
 *   «Название», год г.                                italic 13pt
 *   Материал, техника                                 normal 11pt  (optional)
 *   Размер                                            normal 10pt  (optional)
 *   КП-001                                            grey 8pt right (optional)
 */

"use strict";

const fs   = require("fs");
const path = require("path");

// Resolve docx from local node_modules or global npm
let docx;
try {
  docx = require("docx");
} catch {
  const g = require("child_process").execSync("npm root -g").toString().trim();
  docx = require(path.join(g, "docx"));
}

const {
  Document, Packer, Paragraph, TextRun,
  Table, TableRow, TableCell,
  AlignmentType, WidthType, BorderStyle, VerticalAlign,
} = docx;

// ── CLI args ──────────────────────────────────────────────────────────────────
const [,, inputFile, outputFile] = process.argv;
if (!inputFile || !outputFile) {
  console.error("Usage: node generate.js <input.json> <output.docx>");
  process.exit(1);
}

const paintings = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

// ── Layout (DXA = twips, 1440 per inch) ──────────────────────────────────────
const PAGE_W   = 11906;          // A4 width
const PAGE_H   = 16838;          // A4 height
const MARGIN   = 1134;           // ~2 cm
const CONTENT  = PAGE_W - 2 * MARGIN;
const GAP_H    = 340;            // gap row height between labels (~0.6 cm)
const FONT     = "Times New Roman";

const NO_BORDER  = { style: BorderStyle.NONE,   size: 0, color: "FFFFFF" };
const BOX_BORDER = { style: BorderStyle.SINGLE,  size: 4, color: "999999" };

// ── Helpers ───────────────────────────────────────────────────────────────────

function noBorders() {
  return { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };
}
function boxBorders() {
  return { top: BOX_BORDER, bottom: BOX_BORDER, left: BOX_BORDER, right: BOX_BORDER };
}

function para(text, { bold = false, italic = false, size = 24,
                      align = AlignmentType.CENTER,
                      color, spaceBefore = 0, spaceAfter = 80 } = {}) {
  const run = new TextRun({ text, font: FONT, size, bold, italics: italic,
                             ...(color ? { color } : {}) });
  return new Paragraph({
    children:  [run],
    alignment: align,
    spacing:   { before: spaceBefore, after: spaceAfter },
  });
}

// ── Build label cell ──────────────────────────────────────────────────────────

function labelCell(p) {
  // Line 1: full name + life years
  const name  = [p.last_name, p.first_name, p.patronymic].filter(Boolean).join(" ");
  const life  = p.birth_year
    ? p.death_year ? ` (${p.birth_year}–${p.death_year})` : ` (${p.birth_year})`
    : "";

  const children = [
    para(name + life, { bold: true, size: 28, spaceAfter: 80 }),
    para(`«${p.title}», ${p.year} г.`, { italic: true, size: 26, spaceAfter: 80 }),
  ];

  const mat = [p.material, p.technique].filter(Boolean).join(", ");
  if (mat)    children.push(para(mat, { size: 22, spaceAfter: 60 }));
  if (p.size) children.push(para(p.size, { size: 20, spaceAfter: 60 }));
  if (p.inventory_number)
    children.push(para(p.inventory_number, {
      size: 16, align: AlignmentType.RIGHT, color: "999999", spaceAfter: 0,
    }));

  return new TableCell({
    borders:       boxBorders(),
    width:         { size: CONTENT, type: WidthType.DXA },
    margins:       { top: 280, bottom: 220, left: 320, right: 320 },
    verticalAlign: VerticalAlign.CENTER,
    children,
  });
}

// ── Gap row between labels ────────────────────────────────────────────────────

function gapRow() {
  return new TableRow({
    height: { value: GAP_H, rule: "exact" },
    children: [new TableCell({
      borders:  noBorders(),
      width:    { size: CONTENT, type: WidthType.DXA },
      children: [new Paragraph({ children: [] })],
    })],
  });
}

// ── Assemble table rows ───────────────────────────────────────────────────────

const rows = [];
paintings.forEach((p, i) => {
  if (i > 0) rows.push(gapRow());
  rows.push(new TableRow({ children: [labelCell(p)] }));
});

// ── Document ──────────────────────────────────────────────────────────────────

const doc = new Document({
  sections: [{
    properties: {
      page: {
        size:   { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      },
    },
    children: [
      new Table({
        width:        { size: CONTENT, type: WidthType.DXA },
        columnWidths: [CONTENT],
        rows,
      }),
    ],
  }],
});

Packer.toBuffer(doc)
  .then(buf => {
    fs.writeFileSync(outputFile, buf);
    console.log(`OK: ${outputFile} (${paintings.length} labels)`);
  })
  .catch(err => { console.error(err); process.exit(1); });
