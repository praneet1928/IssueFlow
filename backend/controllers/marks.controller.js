const db = require('../config/db');
const ExcelJS = require('exceljs');

// 1️⃣ SAVE MARKS
exports.saveMarks = async (req, res) => {
  const { section_id, subject, exam_type, data } = req.body;

  try {
    for (const row of data) {
      await db.promise().query(
        `INSERT INTO marks (roll_no, subject, section_id, exam_type, marks)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE marks = VALUES(marks)`,
        [
          row.roll_no,
          subject,
          section_id,
          exam_type,
          JSON.stringify(row.marks)
        ]
      );
    }

    res.json({ message: "Marks saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Save failed" });
  }
};


// 2️⃣ EXCEL UPLOAD
exports.uploadExcel = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const sheet = workbook.worksheets[0];
    let rows = [];

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      rows.push({
        roll_no: row.getCell(1).value,
        subject: row.getCell(2).value,
        Q1: row.getCell(3).value,
        Q2: row.getCell(4).value
      });
    });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const sharp = require("sharp");
const Tesseract = require("tesseract.js");

exports.uploadScan = async (req, res) => {

  try {

    const processed = "processed.png";

    /* ---------- PREPROCESS IMAGE ---------- */

    await sharp(req.file.path)
      .resize({ width: 3000 })
      .grayscale()
      .normalize()
      .sharpen()
      .threshold(150)
      .toFile(processed);

    const meta = await sharp(processed).metadata();

    const width = meta.width;
    const height = meta.height;

    /* ---------- TABLE POSITION ---------- */

    const tableTop = Math.floor(height * 0.35);
    const rowHeight = 55;

    /* ---------- COLUMN POSITIONS ---------- */

    const columns = {
      q1: 350,
      q2: 420,
      q3: 490,
      q4: 560,
      q5: 630,
      q6: 700,
      objective: 820,
      assignment: 900,
      ppt: 970
    };

    const ocrMap = {};
    let rowIndex = 0;

    /* ---------- LOOP THROUGH ROWS ---------- */

    for (let y = tableTop; y + rowHeight <= height; y += rowHeight) {

      const row = {};

      for (const key in columns) {

        const cellFile = `cell_${rowIndex}_${key}.png`;

        await sharp(processed)
          .extract({
            left: columns[key],
            top: y,
            width: 60,
            height: rowHeight
          })
          .toFile(cellFile);

        const result = await Tesseract.recognize(cellFile, "eng");

        let text = result.data.text;

        /* dash means zero */

        text = text.replace(/[-—]/g, "0");

        const digit = text.match(/\d/);

        row[key] = digit ? Number(digit[0]) : 0;
      }

      ocrMap[rowIndex] = row;

      console.log("Row", rowIndex, row);

      rowIndex++;

      if (rowIndex >= 25) break;   // your sheet has ~25 rows
    }

    res.json({ ocrMap });

  }
  catch (err) {

    console.error(err);
    res.status(500).json({ error: "OCR failed" });

  }

};