const express = require("express")
const multer = require("multer")
const { extractMarks } = require("../services/ocrService")

const router = express.Router()

const upload = multer({ dest: "uploads/" })

router.post("/upload-scan", upload.single("file"), async (req, res) => {

  try {

    const ocrMap = await extractMarks(req.file.path)

    res.json({ ocrMap })

  } 
  catch (err) {

    console.error(err)
    res.status(500).json({ error: "OCR failed" })

  }

})

module.exports = router