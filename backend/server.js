const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 1330;

app.get("/", (req, res) => {
  res.send("轉換視頻");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
