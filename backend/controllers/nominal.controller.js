const ExcelJS = require("exceljs");
const db = require("../config/db");

exports.uploadNominalList = async (req, res) => {
  try {
    const { department, year, semester, section } = req.body;

    if (!department || !year || !semester || !section) {
      return res.status(400).json({ error: "Missing academic details" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const sheet = workbook.worksheets[0];

    // 1️⃣ Insert / fetch department (ONCE)
    db.query(
      "INSERT IGNORE INTO departments (department_code) VALUES (?)",
      [department]
    );

    db.query(
      "SELECT department_id FROM departments WHERE department_code=?",
      [department],
      (err, d) => {
        const department_id = d[0].department_id;

        // 2️⃣ Insert / fetch section (ONCE)
        db.query(
          `INSERT IGNORE INTO sections (department_id, year, semester, section_name)
           VALUES (?, ?, ?, ?)`,
          [department_id, year, semester, section]
        );

        db.query(
          `SELECT section_id FROM sections
           WHERE department_id=? AND year=? AND semester=? AND section_name=?`,
          [department_id, year, semester, section],
          (err, s) => {
            const section_id = s[0].section_id;

            // 3️⃣ READ STUDENTS — START FROM ROW 4 (CRITICAL FIX)
            for (let i = 4; i <= sheet.rowCount; i++) {
              const row = sheet.getRow(i);

              const roll_no = row.getCell(2).value;      // H.T.No
              const student_name = row.getCell(3).value; // Name

              if (!roll_no) continue;

              db.query(
                `INSERT IGNORE INTO students (roll_no, student_name, section_id)
                 VALUES (?, ?, ?)`,
                [roll_no.toString().trim(), student_name, section_id]
              );
            }

            res.json({ message: "Nominal list uploaded successfully" });
          }
        );
      }
    );

  } catch (err) {
    console.error("NOMINAL UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
