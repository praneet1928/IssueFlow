/* =========================
   UPLOAD EXCEL (future use)
========================= */
function uploadExcel() {
  const fileInput = document.getElementById("excelFile");
  if (!fileInput || !fileInput.files.length) {
    alert("Please select an Excel file");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  fetch("http://localhost:3000/api/marks/upload-excel", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => console.log("Excel uploaded:", data))
    .catch(err => console.error(err));
}

/* =========================
   LOAD SECTIONS ON PAGE LOAD
========================= */
window.onload = () => {
  fetch("http://localhost:3000/api/sections")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("sectionSelect");
      select.innerHTML = `<option value="">Select Section</option>`;
      
data.forEach(sec => {
  const opt = document.createElement('option');
  opt.value = sec.section_id;
  opt.text = `${sec.department_code} - ${sec.section_name} (Y${sec.year} S${sec.semester})`;
  select.appendChild(opt);
});

    });
};

/* =========================
   LOAD AWARD LIST
========================= */
function loadAwardList() {
  const sectionId = document.getElementById('sectionSelect').value;
  const examType = document.getElementById('examSelect').value;
  const subject = document.getElementById('subjectSelect').value;

  if (!sectionId || !examType || !subject) {
    alert("Please select Section, Exam and Subject");
    return;
  }

  fetch(
    `http://localhost:3000/api/awardlist/load` +
    `?section_id=${sectionId}` +
    `&exam_type=${examType}` +
    `&subject=${encodeURIComponent(subject)}`
  )
    .then(res => res.json())
    .then(data => {
      if (!data.students || data.students.length === 0) {
        alert("No students found for this context");
        return;
      }
      renderAwardTable(data);
    })
    .catch(err => console.error(err));
}


/* =========================
   RENDER TABLE
========================= */
function renderAwardTable(data) {
  const table = document.getElementById("marksTable");

  table.innerHTML = `
    <thead>
      <tr>
        <th>S.No</th>
        <th>Roll No</th>
        <th colspan="7">Part-B</th>
        <th>Objective</th>
        <th>Assignment</th>
        <th>PPT/Viva</th>
        <th>Total</th>
      </tr>
      <tr>
        <th></th><th></th>
        <th>Q1</th><th>Q2</th><th>Q3</th>
        <th>Q4</th><th>Q5</th><th>Q6</th>
        <th>Total</th>
        <th></th><th></th><th></th><th></th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");

  data.students.forEach((s, index) => {
    const m =
  typeof s.marks === "string"
    ? JSON.parse(s.marks)
    : s.marks || {};


    tbody.innerHTML += `
      <tr data-roll="${s.roll_no}">
        <td>${index + 1}</td>
        <td>${s.roll_no}</td>

        <td contenteditable>${m.Q1 ?? ""}</td>
        <td contenteditable>${m.Q2 ?? ""}</td>
        <td contenteditable>${m.Q3 ?? ""}</td>
        <td contenteditable>${m.Q4 ?? ""}</td>
        <td contenteditable>${m.Q5 ?? ""}</td>
        <td contenteditable>${m.Q6 ?? ""}</td>

        <td>${m.partB_total ?? ""}</td>
        <td contenteditable>${m.objective ?? ""}</td>
        <td contenteditable>${m.assignment ?? ""}</td>
        <td contenteditable>${m.ppt ?? ""}</td>
        <td>${m.total ?? ""}</td>
      </tr>
    `;
  });

  document.getElementById("awardListBox").classList.remove("hidden");
  document.getElementById("saveBox").classList.remove("hidden");
document.querySelectorAll("#marksTable tbody tr")
.forEach(row => recalculateRow(row));
}


/* =========================
   CALCULATIONS
========================= */
function recalculateRow(row) {
  const get = (i) => Number(row.cells[i].innerText) || 0;

  const qs = [
    get(2), get(3), get(4), get(5), get(6), get(7)
  ];

  const objective  = get(9);
  const assignment = get(10);
  const ppt        = get(11);

  // ---- VALIDATION FLAGS ----
  let hasError = false;

  // Q1–Q6 max 5
  if (qs.some(q => q < 0 || q > 5)) hasError = true;

  // Objective max 10
  if (objective < 0 || objective > 10) hasError = true;

  // Assignment max 5
  if (assignment < 0 || assignment > 5) hasError = true;

  // PPT max 5
  if (ppt < 0 || ppt > 5) hasError = true;

  // ---- CALCULATIONS (ONLY IF VALID) ----
  let partB = 0;
  let total = 0;

  if (!hasError) {
    const best4 = [...qs].sort((a, b) => b - a).slice(0, 4);
    partB = best4.reduce((a, b) => a + b, 0);
    total = partB + objective + assignment + ppt;
  }

  // Update display
  row.cells[8].innerText  = partB || "";
  row.cells[12].innerText = total || "";

  validateRow(row, {
    qs,
    objective,
    assignment,
    ppt,
    partB,
    total,
    hasError
  });
}



function validateRow(row, m) {

  row.classList.remove("row-valid", "row-error");

  /* ERROR */
  if (m.hasError) {
    row.classList.add("row-error");
    return;
  }

  /* EMPTY ROW = KEEP WHITE */
  if (m.total === 0) {
    return;
  }

  /* VALID */
  row.classList.add("row-valid");
}


/* =========================
   SAVE MARKS
========================= */
function saveMarks() {
  const section_id = sectionSelect.value;
  const exam_type  = examSelect.value;
  const subject    = subjectSelect.value;

  if (!section_id || !exam_type || !subject) {
    alert("Context missing");
    return;
  }

  const rows = document.querySelectorAll("#marksTable tbody tr");
  const data = [];

  rows.forEach(row => {
    const cells = row.cells;
    data.push({
      roll_no: row.dataset.roll,
      marks: {
        Q1: +cells[2].innerText || 0,
        Q2: +cells[3].innerText || 0,
        Q3: +cells[4].innerText || 0,
        Q4: +cells[5].innerText || 0,
        Q5: +cells[6].innerText || 0,
        Q6: +cells[7].innerText || 0,
        partB_total: +cells[8].innerText || 0,
        objective: +cells[9].innerText || 0,
        assignment: +cells[10].innerText || 0,
        ppt: +cells[11].innerText || 0,
        total: +cells[12].innerText || 0
      }
    });
  });

  fetch("http://localhost:3000/api/marks/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section_id, subject, exam_type, data })
  })
    .then(res => res.json())
    .then(() => alert("Marks saved (draft)"))
    .catch(() => alert("Save failed"));
}

/* =========================
   UPLOAD NOMINAL ROLL LIST
========================= */
function uploadNominal() {
  const fileEl = document.getElementById("nominalFile");
  const deptEl = document.getElementById("dept");
  const yearEl = document.getElementById("year");
  const semEl  = document.getElementById("sem");
  const secEl  = document.getElementById("section");

  if (
    !fileEl || !fileEl.files.length ||
    !deptEl.value || !yearEl.value ||
    !semEl.value || !secEl.value
  ) {
    alert("Fill all academic details and choose nominal Excel file");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileEl.files[0]);
  formData.append("department", deptEl.value);
  formData.append("year", yearEl.value);
  formData.append("semester", semEl.value);
  formData.append("section", secEl.value);

  fetch("http://localhost:3000/api/nominal/upload", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Nominal list uploaded successfully");
    })
    .catch(err => {
      console.error(err);
      alert("Nominal upload failed");
    });
}


/* =========================
   EXPORT EXCEL
========================= */
function exportExcel() {
  const section = document.getElementById("sectionSelect").value;
  const subject = document.getElementById("subjectSelect").value;
  const exam    = document.getElementById("examSelect").value;

  if (!section || !subject || !exam) {
    alert("Select Section, Subject and Exam before exporting");
    return;
  }

  window.location.href =
    `http://localhost:3000/api/export/excel` +
    `?section_id=${section}` +
    `&subject=${encodeURIComponent(subject)}` +
    `&exam_type=${exam}`;
}



/* =========================
   EXPORT PDF
========================= */
function exportPDF() {
  const section = document.getElementById("sectionSelect").value;
  const subject = document.getElementById("subjectSelect").value;
  const exam    = document.getElementById("examSelect").value;

  if (!section || !subject || !exam) {
    alert("Select Section, Subject and Exam before exporting");
    return;
  }

  window.location.href =
    `http://localhost:3000/api/export/pdf` +
    `?section_id=${section}` +
    `&subject=${encodeURIComponent(subject)}` +
    `&exam_type=${exam}`;
}


document.addEventListener("input", (e) => {

  const cell = e.target;

  if (!cell.hasAttribute("contenteditable")) return;

  const row = cell.closest("tr");
  if (!row) return;

  /* SAVE CURSOR POSITION */
  const selection = window.getSelection();
  const position = selection.focusOffset;

  let clean = cell.innerText;

  /* RESTRICT USER INPUT ONLY (NOT OCR) */
  if (!row.classList.contains("ocr-row")) {
    clean = clean.replace(/[^0-9]/g, "");
  }

  cell.innerText = clean;

  /* RESTORE CURSOR POSITION */
  const range = document.createRange();
  range.setStart(cell.childNodes[0] || cell, Math.min(position, clean.length));
  range.collapse(true);

  selection.removeAllRanges();
  selection.addRange(range);

  recalculateRow(row);

});


function uploadScannedAward() {

  const fileInput = document.getElementById("scanFile");
  const section   = document.getElementById("sectionSelect").value;
  const subject   = document.getElementById("subjectSelect").value;
  const examType  = document.getElementById("examSelect").value;

  if (!fileInput.files.length) {
    alert("Please select a scanned award list image");
    return;
  }

  const file = fileInput.files[0];

  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file (jpg, png)");
    return;
  }

  if (!section || !examType || !subject) {
    alert("Please select Section, Subject and Exam before scanning");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("section_id", section);
  formData.append("subject", subject);
  formData.append("exam_type", examType);

  fetch("http://localhost:3000/api/marks/upload-scan", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {

    if (!data.ocrMap || Object.keys(data.ocrMap).length === 0) {
      alert("OCR completed but no marks were detected");
      return;
    }

    applyOCRToTable(data.ocrMap);

    alert("OCR data applied. Please verify highlighted rows.");

  })
  .catch(err => {
    console.error("Scan upload failed:", err);
    alert("Scan upload failed. Check server logs.");
  });

}


function applyOCRToTable(ocrMap) {

  const rows = document.querySelectorAll("#marksTable tbody tr");
  const values = Object.values(ocrMap);

  console.log("OCR Map:", ocrMap);

  rows.forEach((row, index) => {

    const m = values[index];
    if (!m) return;

    row.cells[2].innerText = m.q1 || "";
    row.cells[3].innerText = m.q2 || "";
    row.cells[4].innerText = m.q3 || "";
    row.cells[5].innerText = m.q4 || "";
    row.cells[6].innerText = m.q5 || "";
    row.cells[7].innerText = m.q6 || "";

    row.cells[9].innerText = m.objective || "";
    row.cells[10].innerText = m.assignment || "";
    row.cells[11].innerText = m.ppt || "";

    recalculateRow(row);

    row.classList.add("ocr-row");

  });

}