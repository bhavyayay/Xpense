import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "XPense API" });
});

app.listen(PORT, () => {
  console.log(`✅ XPense API running at http://localhost:${PORT}`);
});
