const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  const sql = `
    SELECT s.section_id, s.section_name, s.year, s.semester, d.department_code
    FROM sections s
    JOIN departments d ON s.department_id = d.department_id
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

module.exports = router;
