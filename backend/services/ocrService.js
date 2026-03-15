const Tesseract = require("tesseract.js")
const sharp = require("sharp")
const path = require("path")

async function extractMarks(imagePath){

  const processedPath = path.join(__dirname,"processed.png")

  /* ---------- IMAGE PREPROCESSING ---------- */

  await sharp(imagePath)
  .resize({ width: 3000 })
  .grayscale()
  .normalize()
  .sharpen()
  .median(1)
  .threshold(150)
  .toFile(processedPath)

  /* ---------- OCR ---------- */

 const { data:{ text } } = await Tesseract.recognize(
  processedPath,
  "eng",
  {
    logger: m => console.log(m),
    tessedit_pageseg_mode: 4
  }
)

  console.log("\n========== OCR RAW ==========\n")
  console.log(text)

  const lines = text.split("\n")
const ocrMap = {}

lines.forEach(line => {

  line = line.trim()

  if(!line) return

  line = line.replace(/[-—]/g," 0 ")

  /* detect roll numbers like 22WJ1A05U3 */

  const rollMatch = line.match(/22WJ[A-Z0-9]+/i)

  if(!rollMatch) return

  const roll = rollMatch[0]

  const nums = line.match(/\d+/g)

  if(!nums || nums.length < 7) return

  const row = {
    q1: Number(nums[1]) || 0,
    q2: Number(nums[2]) || 0,
    q3: Number(nums[3]) || 0,
    q4: Number(nums[4]) || 0,
    q5: Number(nums[5]) || 0,
    q6: Number(nums[6]) || 0,
    objective: Number(nums[7]) || 0,
    assignment: Number(nums[8]) || 0,
    ppt: Number(nums[9]) || 0
  }

  ocrMap[roll] = row

})

  console.log("\n========== OCR MAP ==========\n")
  console.log(ocrMap)
  console.log("FINAL OCR MAP:", ocrMap)
  return ocrMap
}

module.exports = { extractMarks }