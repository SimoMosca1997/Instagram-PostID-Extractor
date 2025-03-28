const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint per servire il file HTML
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Endpoint per estrarre il Post ID dalla sorgente della pagina
app.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Lancia Puppeteer
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Vai al link di Instagram
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Ottieni il contenuto HTML della pagina
    const html = await page.content();

    // Usa regex per trovare il Post ID
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

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
