// 1️⃣ Imports
const express = require("express");
const cors = require("cors");

// 2️⃣ Create app FIRST
const app = express();

// 3️⃣ Config
const PORT = 3000;
require("./config/db");

// 4️⃣ Middleware
app.use(cors());
app.use(express.json());

// 5️⃣ Test root route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("SERVER OK");
});

// 6️⃣ Routes
const authRoutes = require("./routes/auth.routes");
const marksRoutes = require("./routes/marks.routes");
const exportRoutes = require("./routes/export.routes");
const nominalRoutes = require("./routes/nominal.routes");
const sectionsRoutes = require("./routes/sections.routes");
const awardListRoutes = require("./routes/awardlist.routes");
const ocrRoutes = require("./routes/ocrRoutes")

console.log("marksRoutes:", Object.keys(marksRoutes));

// 7️⃣ Route registration (ONCE)
app.use("/api/auth", authRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/nominal", nominalRoutes);
app.use("/api/sections", sectionsRoutes);
app.use("/api/awardlist", awardListRoutes);
app.use("/api/marks", ocrRoutes)
// 8️⃣ Start server LAST
app.listen(PORT, () => {
  console.log("server loaded on port", PORT);
});
