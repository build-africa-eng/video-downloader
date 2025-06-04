// download.js
const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("YouTube Downloader is running.");
});

app.post("/download", async (req, res) => {
  const url = req.body.url;

  if (!url) return res.status(400).send("Missing 'url' field.");

  const filename = `video-${Date.now()}.mp4`;
  const filepath = path.join(__dirname, filename);
  const command = `yt-dlp -f mp4 -o "${filepath}" "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return res.status(500).send("Download failed");
    }

    res.download(filepath, () => {
      fs.unlinkSync(filepath);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
