
function hideAllModes() {
  document.getElementById("excelMode").classList.add("hidden");
  document.getElementById("ocrMode").classList.add("hidden");
  document.getElementById("nominalMode").classList.add("hidden");
  document.getElementById("manualMode").classList.add("hidden");
  document.getElementById("exportMode").classList.add("hidden");
  document.getElementById("contextBox").classList.add("hidden");
  document.getElementById("awardListBox").classList.add("hidden");
}

function setMode(mode) {
  hideAllModes();

  switch (mode) {
    case "excel":
      document.getElementById("contextBox").classList.remove("hidden");
      document.getElementById("excelMode").classList.remove("hidden");
      break;

    case "ocr":
      document.getElementById("contextBox").classList.remove("hidden");
      document.getElementById("ocrMode").classList.remove("hidden");
      break;

    case "nominal":
      document.getElementById("nominalMode").classList.remove("hidden");
      break;

    case "manual":
      document.getElementById("contextBox").classList.remove("hidden");
      document.getElementById("manualMode").classList.remove("hidden");
      break;

    case "export":
      document.getElementById("contextBox").classList.remove("hidden");
      document.getElementById("exportMode").classList.remove("hidden");
      break;
  }
}
