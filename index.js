const express = require("express");
const cors = require("cors");
const launchBrowser = require("./launchBrowser"); // Importa la funzione per avviare Puppeteer

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const browser = await launchBrowser(); // Usa Puppeteer con i flag configurati
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    const html = await page.content();

    const regex = /content="instagram:\/\/media\?id=([0-9]+)"/;
    const match = html.match(regex);

    if (match && match[1]) {
      const postId = match[1];
      res.json({ postId });
    } else {
      res.status(400).json({ error: "Unable to find Post ID" });
    }

    await browser.close();
  } catch (error) {
    console.error("Error extracting Post ID:", error);
    res.status(500).json({ error: "An error occurred while processing the request" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
