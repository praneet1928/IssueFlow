console.log("✅ export.routes.js LOADED");

const express = require("express");
const router = express.Router();

const exportController = require("../controllers/export.controller");

console.log("exportController keys:", Object.keys(exportController));

router.get("/excel", exportController.exportExcel);
router.get("/pdf", exportController.exportPDF);

module.exports = router;
