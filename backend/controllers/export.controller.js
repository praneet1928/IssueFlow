const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const db = require("../config/db");


function numberToWords(n) {
  const ones = [
    "Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen",
    "Seventeen","Eighteen","Nineteen"
  ];

  const tens = [
    "", "", "Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"
  ];

  if (n < 20) return ones[n];
  if (n < 100)
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");

  return n.toString(); // fallback (won’t happen in your case)
}

/* =========================
   EXPORT EXCEL
========================= */
exports.exportExcel = async (req, res) => {
  try {
    const { section_id, subject, exam_type } = req.query;
    if (!section_id || !subject || !exam_type) {
      return res.status(400).json({ error: "Missing export parameters" });
    }

    const sql = `
      SELECT
        s.roll_no,
        CAST(JSON_EXTRACT(m.marks,'$.Q1') AS UNSIGNED) AS Q1,
        CAST(JSON_EXTRACT(m.marks,'$.Q2') AS UNSIGNED) AS Q2,
        CAST(JSON_EXTRACT(m.marks,'$.Q3') AS UNSIGNED) AS Q3,
        CAST(JSON_EXTRACT(m.marks,'$.Q4') AS UNSIGNED) AS Q4,
        CAST(JSON_EXTRACT(m.marks,'$.Q5') AS UNSIGNED) AS Q5,
        CAST(JSON_EXTRACT(m.marks,'$.Q6') AS UNSIGNED) AS Q6,
        CAST(JSON_EXTRACT(m.marks,'$.partB_total') AS UNSIGNED) AS partB,
        CAST(JSON_EXTRACT(m.marks,'$.objective') AS UNSIGNED) AS objective,
        CAST(JSON_EXTRACT(m.marks,'$.assignment') AS UNSIGNED) AS assignment,
        CAST(JSON_EXTRACT(m.marks,'$.ppt') AS UNSIGNED) AS ppt,
        CAST(JSON_EXTRACT(m.marks,'$.total') AS UNSIGNED) AS total,
        sec.section_name,
        sec.year,
        sec.semester
      FROM marks m
      JOIN students s ON m.roll_no = s.roll_no
      JOIN sections sec ON sec.section_id = m.section_id
      WHERE m.section_id = ? AND m.subject = ? AND m.exam_type = ?
      ORDER BY s.roll_no
    `;

    const [rows] = await db.promise().query(sql, [
      section_id,
      subject,
      exam_type
    ]);

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Award List", {
      pageSetup: { paperSize: 9, orientation: "portrait"}
    });

    /* ---------------- COLUMN WIDTHS ---------------- */
    ws.columns = [
  { width: 5  }, // Sl No
  { width: 14 }, // Roll No
  { width: 4  }, // Q1
  { width: 4  }, // Q2
  { width: 4  }, // Q3
  { width: 4  }, // Q4
  { width: 4  }, // Q5
  { width: 4  }, // Q6
  { width: 6  }, // Total (20)
  { width: 6  }, // Objective
  { width: 7  }, // Assignment
  { width: 7  }, // PPT/Viva
  { width: 6  }, // Total (40)
  { width: 16 }  // Marks in Words
];

    /* ---------------- TITLE BLOCK ---------------- */
    const gniLogo = wb.addImage({
  filename: 'assets/gnilogo.png',
  extension: 'png'
});

const naacLogo = wb.addImage({
  filename: 'assets/naac.png',
  extension: 'png'
});

    ws.mergeCells("A1:N3");
    ws.getRow(1).height = 28;
    ws.getCell("A1").value = {
      richText: [
        { text: "GURU NANAK INSTITUTIONS TECHNICAL CAMPUS\n", font: { name: "Times New Roman", bold: true, size: 16 }},
        { text: "(An UGC Autonomous Institution - Affiliated to JNTUH)\n", font: { name: "Times New Roman", size: 10 }},
        { text: "Ibrahimpatnam, Ranga Reddy (District) - 501 506.", font: { name: "Times New Roman", size: 10 }}
        
      ]
    };
    // LEFT LOGO (GNI) — left aligned
ws.addImage(gniLogo, {
  tl: { col: 0.7, row: 0.2 },
  ext: { width: 38, height: 28 },
  editAs: 'oneCell'
});



// RIGHT LOGO — scaled & vertically aligned inside title cell
ws.addImage(naacLogo, {
  tl: { col: 13.99, row: 1 },   // 👈 anchor to column O visually
  ext: { width: 38, height: 32 },
  editAs: 'oneCell'
});



    ws.getCell("A1").alignment = { horizontal: "center", vertical: "middle" , wrapText: true};
    ws.getCell("A1").border = { top:{style:"thin"}, left:{style:"thin"}, right:{style:"thin"}, bottom:{style:"thin"} };

    ws.mergeCells("A4:N4");
    ws.getCell("A4").value = "AWARD LIST";
    ws.getCell("A4").font = { name: "Times New Roman", bold: true, size: 13 };
    ws.getCell("A4").alignment = { horizontal: "center", vertical: "middle" };

    ws.mergeCells("A5:N5");
    ws.getCell("A5").value =
      `B.Tech ${rows[0].year} Year ${rows[0].semester} Semester - [R22] (2025-26)`;
    ws.getCell("A5").font = { name: "Times New Roman", bold: true, underline: true, size: 13 };
    ws.getCell("A5").alignment = { horizontal: "center" };

    /* ---------------- DETAILS TABLE ---------------- */
    ws.mergeCells("A6:G6");
    ws.mergeCells("H6:N6");
    ws.getCell("A6").value = "Mid Exam No :";
    ws.getCell("A6").alignment = { horizontal: "left" };
    ws.getCell("H6").value = `Subject & Code :    ${subject}`;

    ws.mergeCells("A7:G7");
    ws.mergeCells("H7:N7");
    ws.getCell("A7").value = `Branch & Section :    CSE-${rows[0].section_name}`;
    ws.getCell("H7").value = "Date of Exam :";

    ws.mergeCells("A8:N8");
    ws.getCell("A8").value = "Faculty Name & ID :";

    ["A6","H6","A7","H7","A8"].forEach(c=>{
      ws.getCell(c).font = { name: "Times New Roman", bold: true };
      ws.getCell(c).border = { top:{style:"thin"}, left:{style:"thin"}, right:{style:"thin"}, bottom:{style:"thin"} };
    });
    
    /* ---------------- TABLE HEADERS ---------------- */
    ws.mergeCells("A9:A10");
    ws.mergeCells("B9:B10");
    ws.mergeCells("C9:I9");
    ws.mergeCells("J9:J10");
    ws.mergeCells("K9:K10");
    ws.mergeCells("L9:L10");
    ws.mergeCells("M9:M10");
    ws.mergeCells("N9:N10");
    ws.views = [
      { state: 'frozen', ySplit: 10 }
    ];
    ws.getRow(9).height = 28;
    ws.getCell("A9").value = "Sl No";
    ws.getCell("B9").value = "Roll No";
    ws.getCell("C9").value = "Part-B - Descriptive Paper (20 Marks)";
    ws.getCell("J9").value = "Objective (10)";
    ws.getCell("K9").value = "Assignment (05)";
    ws.getCell("L9").value = "PPT/Viva (05)";
    ws.getCell("M9").value = "Total (40)";
    ws.getCell("N9").value = "Marks in Words";
    ws.getRow(10).height = 22;
    ["C10","D10","E10","F10","G10","H10","I10"].forEach((c,i)=>{
      ws.getCell(c).value = i === 6 ? "Total (20)" : `Q${i+1}`;
    });
    
    ws.getRow(9).font = ws.getRow(10).font = { name: "Roboto" , bold: true , size: 9 };
    ws.getRow(9).alignment = ws.getRow(10).alignment =
    { wrapText: true , horizontal:"center", vertical:"middle" };
    for (let i = 11; i <= ws.rowCount; i++) {
      ws.getRow(i).height = 20;
    }
    ws.eachRow((row, rowNumber) => {
      if (rowNumber >= 11) {
        row.font = { name: "Roboto", size: 9 };
        
      }
    });
    
    ws.eachRow(row => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    
    /* ---------------- DATA ROWS ---------------- */
    let r = 11;
rows.forEach((row, idx) => {
  ws.addRow([
    idx + 1,
    row.roll_no,
    row.Q1, row.Q2, row.Q3, row.Q4, row.Q5, row.Q6,
    row.partB,
    row.objective,
    row.assignment,
    row.ppt,
    row.total,
    numberToWords(row.total)
  ]);

  const excelRow = ws.getRow(r);

  // alignment
  excelRow.alignment = {
    horizontal: "center",
    vertical: "middle"
  };

  // ✅ ADD BORDERS TO ALL CELLS IN THIS ROW
  excelRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = {
      top:    { style: "thin" },
      left:   { style: "thin" },
      bottom: { style: "thin" },
      right:  { style: "thin" }
    };
  });

  r++;
});

    ws.pageSetup = {
  paperSize: 9,           // A4
  orientation: 'portrait',
  fitToPage: true,
  //fitToWidth: 1,          // ✅ ONE page width
 // fitToHeight: false,     // allow vertical pages
  //scale: 85               // reduces clipping, keeps text readable
};
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=award_list_${subject}_${exam_type}.xlsx`
    );
    await wb.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ error: err.message });
  }
};



/* =========================
   EXPORT PDF
========================= */
exports.exportPDF = async (req, res) => {
  try {
    const { section_id, subject, exam_type } = req.query;
    if (!section_id || !subject || !exam_type) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    // ---------------- FETCH DATA ----------------
    const sql = `
      SELECT 
        s.roll_no,
        CAST(JSON_EXTRACT(m.marks,'$.Q1') AS UNSIGNED) AS Q1,
        CAST(JSON_EXTRACT(m.marks,'$.Q2') AS UNSIGNED) AS Q2,
        CAST(JSON_EXTRACT(m.marks,'$.Q3') AS UNSIGNED) AS Q3,
        CAST(JSON_EXTRACT(m.marks,'$.Q4') AS UNSIGNED) AS Q4,
        CAST(JSON_EXTRACT(m.marks,'$.Q5') AS UNSIGNED) AS Q5,
        CAST(JSON_EXTRACT(m.marks,'$.Q6') AS UNSIGNED) AS Q6,
        CAST(JSON_EXTRACT(m.marks,'$.partB_total') AS UNSIGNED) AS partB,
        CAST(JSON_EXTRACT(m.marks,'$.objective') AS UNSIGNED) AS objective,
        CAST(JSON_EXTRACT(m.marks,'$.assignment') AS UNSIGNED) AS assignment,
        CAST(JSON_EXTRACT(m.marks,'$.ppt') AS UNSIGNED) AS ppt,
        CAST(JSON_EXTRACT(m.marks,'$.total') AS UNSIGNED) AS total,
        sec.section_name,
        sec.year,
        sec.semester
      FROM marks m
      JOIN students s ON m.roll_no = s.roll_no
      JOIN sections sec ON sec.section_id = m.section_id
      WHERE m.section_id = ?
        AND m.subject = ?
        AND m.exam_type = ?
      ORDER BY s.roll_no
    `;

    const [rows] = await db.promise().query(sql, [
      section_id,
      subject,
      exam_type
    ]);

    if (!rows.length) {
      return res.status(404).json({ error: "No data found" });
    }

    // ---------------- PDF INIT ----------------
    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument({ size: "A4", margin: 25 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Award_${subject}_${exam_type}.pdf`
    );
    doc.pipe(res);

    // ---------------- NUMBER TO WORDS ----------------
    const numberToWords = (n) => {
      const ones = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
        "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen",
        "Eighteen","Nineteen"];
      const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " " + ones[n%10] : "");
      return n.toString();
    };

    // ---------------- DRAW HELPERS ----------------
    const drawCellCenter = (x, y, w, h, text = "") => {
  doc.rect(x, y, w, h).stroke();

  const t = String(text ?? "");

  const textHeight = doc.heightOfString(t, {
    width: w - 6,
    align: "center",
    lineBreak: false
  });

  const textY = y + (h - textHeight) / 2;

  doc.text(t, x + 3, textY, {
    width: w - 6,
    align: "center",
    lineBreak: false
  });
};


const drawCellLeft = (x, y, w, h, text = "", bold = false) => {
  doc.rect(x, y, w, h).stroke();

  if (bold) {
    doc.font("Helvetica-Bold");
  } else {
    doc.font("Helvetica");
  }

  const t = String(text ?? "");

  const textHeight = doc.heightOfString(t, {
    width: w - 10,
    align: "left"
  });

  const textY = y + (h - textHeight) / 2;

  doc.text(t, x + 5, textY, {
    width: w - 10,
    align: "left"
  });
};

const drawCellCenterStyled = (x, y, w, h, text = "", options = {}) => {
  doc.rect(x, y, w, h).stroke();

  // Font selection
  if (options.font === "Times-Bold") {
    doc.font("Times-Bold");
  } else if (options.font === "Times-Roman") {
    doc.font("Times-Roman");
  } else if (options.bold) {
    doc.font("Helvetica-Bold");
  } else {
    doc.font("Helvetica");
  }

  if (options.fontSize) {
  doc.fontSize(options.fontSize);
}


  const textHeight = doc.heightOfString(text, {
    width: w - 10,
    align: "center"
  });

  const textY = y + (h - textHeight) / 2+1;

  doc.text(text, x + 5, textY, {
    width: w - 10,
    align: "center"
  });

  // ---- UNDERLINE ONLY TEXT WIDTH ----
  if (options.underline) {
    const textWidth = doc.widthOfString(text, { width: w - 10 });
    const lineX = x + (w - textWidth) / 2;
    const lineY = textY + textHeight;

    doc
      .moveTo(lineX, lineY)
      .lineTo(lineX + textWidth, lineY)
      .stroke();
  }

};


    // ---------------- TITLE ----------------
    let y = 20;
const startX = 28;
const tableW = 540;
const rowH = 28;

// Institute Name
const titleCellHeight = rowH * 2;

// draw ONE cell
doc.rect(startX, y, tableW, titleCellHeight).stroke();



// ---------- LOGOS INSIDE TITLE CELL ----------
const logoY = y + 8;

doc.image("assets/gnilogo.png", startX + 8, logoY, {
  width: 40
});

doc.image("assets/naac.png", startX + tableW - 53, logoY, {
  width: 40
});

// ---- GURU NANAK LINE (BIG + BOLD) ----
doc.font("Times-Bold").fontSize(16);
doc.text(
  "GURU NANAK INSTITUTIONS TECHNICAL CAMPUS",
  startX,
  y + 10,
  { width: tableW, align: "center" }
);

// ---- UGC / AFFILIATION LINE (SMALL + NORMAL) ----
doc.font("Times-Roman").fontSize(10);
doc.text(
  "(An UGC Autonomous Institution - Affiliated to JNTUH)\nIbrahimpatnam, Ranga Reddy (District) - 501 506",
  startX,
  y + 28,
  { width: tableW, align: "center" }
);

y += titleCellHeight;


// AWARD LIST
drawCellCenterStyled(
  startX,
  y,
  tableW,
  rowH - 5,
  "AWARD LIST",
  { bold: true, font: "Times-Bold",fontSize: 13 }
);
y += rowH - 5;


// B.Tech line (BOLD + UNDERLINE)
drawCellCenterStyled(
  startX,
  y,
  tableW,
  rowH - 1,
  `B.Tech ${rows[0].year} Year ${rows[0].semester} Semester - [R22] (2025-26)`,
  { bold: true, underline: true, font: "Times-Bold",fontSize: 13 }
);

y += rowH - 1;



// ---------------- TOP DETAILS TABLE ----------------

doc.font("Times-Roman").fontSize(10);
drawCellLeft(startX, y, tableW / 2, rowH - 2, "Mid Exam No : ",{ bold: true, font: "Times-Roman",fontSize: 11 });
drawCellLeft(startX + tableW / 2, y, tableW / 2, rowH - 2, `Subject & Code : ${subject}`,{ bold: true, font: "Times-Bold",fontSize: 11 });

y += rowH-2;

drawCellLeft(startX, y, tableW / 2, rowH - 2, `Branch & Section : CSE-${rows[0].section_name}`,{ font: "Times-Bold",fontSize: 11 });
drawCellLeft(startX + tableW / 2, y, tableW / 2, rowH - 2, "Date of Exam : ",{ font: "Times-Bold",fontSize: 11 });

y += rowH-2;
drawCellLeft(startX, y, tableW, rowH - 2, "Faculty Name & ID : ",{ font: "Times-Bold",fontSize: 11 });

y += rowH-2 ;

// ---------------- COLUMN WIDTHS ----------------
const col = {
  sl: 29, roll: 78, q: 30,
  obj: 37, asg: 37, ppt: 37,
  total40: 37, words: 75
};

const h1 = 30, h2 = 26;

// ---------------- HEADER ROW 1 ----------------
let x = startX;

    doc.font("Helvetica-Bold").fontSize(9);

    drawCellCenter(x, y, col.sl, h1 + h2, "Sl.\nNo."); x += col.sl;
    drawCellCenter(x, y, col.roll, h1 + h2, "Roll No."); x += col.roll;

    const pbX = x;
    drawCellCenter(pbX, y, col.q * 7, h1, "Part-B - Descriptive Paper (20 Marks)");
    drawCellCenter(pbX + col.q * 7, y, col.obj, h1 + h2, "Objective\n(10)");
    drawCellCenter(pbX + col.q * 7 + col.obj, y, col.asg, h1 + h2, "Assignment\n(05)");
    drawCellCenter(pbX + col.q * 7 + col.obj + col.asg, y, col.ppt, h1 + h2, "PPT/Viva\n(05)");
    drawCellCenter(pbX + col.q * 7 + col.obj + col.asg + col.ppt, y, col.total40, h1 + h2, "Total (40)");
    drawCellCenter(pbX + col.q * 7 + col.obj + col.asg + col.ppt + col.total40, y, col.words, h1 + h2, "Marks in Words");

    // ---------------- HEADER ROW 2 ----------------
    let qx = pbX;
    for (let i = 1; i <= 6; i++) {
      drawCellCenter(qx, y + h1, col.q, h2, i.toString());
      qx += col.q;
    }
    drawCellCenter(qx, y + h1, col.q, h2, "Total (20)");

    // ---------------- DATA ROWS ----------------
    doc.font("Helvetica").fontSize(9);
    y += h1 + h2;
    rows.forEach((r, i) => {
      if (y > 780) {
        doc.addPage();
        y = 50;
      }

      let cx = startX;
      drawCellCenter(cx, y, col.sl, h2, i + 1); cx += col.sl;
      drawCellCenter(cx, y, col.roll, h2, r.roll_no); cx += col.roll;

      [r.Q1,r.Q2,r.Q3,r.Q4,r.Q5,r.Q6,r.partB].forEach(v => {
        drawCellCenter(cx, y, col.q, h2, v ?? "");
        cx += col.q;
      });

      drawCellCenter(cx, y, col.obj, h2, r.objective); cx += col.obj;
      drawCellCenter(cx, y, col.asg, h2, r.assignment); cx += col.asg;
      drawCellCenter(cx, y, col.ppt, h2, r.ppt); cx += col.ppt;
      drawCellCenter(cx, y, col.total40, h2, r.total);
      drawCellCenter(cx + col.total40, y, col.words, h2, numberToWords(r.total));

      y += h2;
    });

    doc.end();

  } catch (err) {
    console.error("PDF export error:", err);
    res.status(500).json({ error: err.message });
  }
};
