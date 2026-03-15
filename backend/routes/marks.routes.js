const express = require('express');
const multer = require('multer');
const marksController = require('../controllers/marks.controller');

const router = express.Router();

const uploadExcel = multer({ dest: 'uploads/excel/' });
const uploadScan = multer({ dest: 'uploads/scanned/' });

router.post('/save', marksController.saveMarks);
router.post('/upload-excel', uploadExcel.single('file'), marksController.uploadExcel);
router.post('/upload-scan', uploadScan.single('file'), marksController.uploadScan);
console.log('marksController:', Object.keys(marksController));

module.exports = router;
