const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

const PORT = process.env.PORT || 1330;

// app.get("/", (req, res) => {
//   res.send("轉換視頻");
// });

app.get("/", (req, res) => {
  res.send("Welcome 轉換視頻");
});

/**
 * 轉換視頻路由
 * @description Transcribe video
 * @route POST /transcribe
 * @access Public
 */
app.post("/transcribe", upload.single("file"), async (req, res) => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-1",
    });
    console.log("🚀 ~ app.post ~ transcription:", transcription);
    res.send(transcription);
  } catch (error) {
    console.log("🚀 ~ app.post ~ error:", error);
    if (error.response) {
      console.log(error.response.status);
      res.status(500).send(error.response.data);
    } else {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  }

  return res.json({ message: "Transcribe" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
