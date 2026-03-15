const express = require("express");
const multer = require("multer");
const nominalController = require("../controllers/nominal.controller");

const router = express.Router();
const upload = multer({ dest: "uploads/nominal/" });

router.post("/upload", upload.single("file"), nominalController.uploadNominalList);

module.exports = router;
