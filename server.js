const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.post('/extract', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL non fornito!' });
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });
        const content = await page.content();

        const match = content.match(/content="instagram:\/\/media\?id=(\d+)"/);

        await browser.close();

        if (match && match[1]) {
            return res.json({ postId: match[1] });
        } else {
            return res.status(404).json({ error: 'Post ID non trovato!' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Errore durante l\'estrazione!' });
    }
});

app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
