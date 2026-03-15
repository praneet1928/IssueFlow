const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/load', (req, res) => {
  const { section_id, exam_type, subject } = req.query;

  if (!section_id || !exam_type || !subject) {
    return res.status(400).json({ error: "Missing context parameters" });
  }

  // 1️⃣ Get exam template
  const examSql = `SELECT * FROM exam_templates WHERE exam_type = ?`;

  db.query(examSql, [exam_type], (err, examResult) => {
    if (err) return res.status(500).json(err);

    const exam = examResult[0];

    // 2️⃣ Get students + marks (CRITICAL FIX)
    const studentSql = `
      SELECT 
        s.student_id,
        s.roll_no,
        m.marks
      FROM students s
      LEFT JOIN marks m
        ON s.roll_no = m.roll_no
       AND m.section_id = ?
       AND m.exam_type = ?
       AND m.subject = ?
      WHERE s.section_id = ?
      ORDER BY s.roll_no
    `;

    db.query(
      studentSql,
      [
        section_id,  // m.section_id
        exam_type,   // m.exam_type
        subject,     // m.subject
        section_id   // s.section_id
      ],
      (err, students) => {
        if (err) return res.status(500).json(err);

        res.json({
          examTemplate: exam,
          students
        });
      }
    );
  });
});

module.exports = router;
