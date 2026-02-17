const puppeteer = require('puppeteer');

async function extractPostId(instagramUrl) {
    if (!instagramUrl) {
        console.log('URL non fornito!');
        return;
    }

    try {
        // Avvia il browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Vai all'URL di Instagram
        await page.goto(instagramUrl, { waitUntil: 'networkidle2' });

        // Estrai il contenuto HTML della pagina
        const content = await page.content();

        // Cerca il Post ID nel contenuto della pagina
        const match = content.match(/media_id['"]?\s*:\s*['"](\d+)['"]/);
        if (match && match[1]) {
            console.log(`Post ID trovato: ${match[1]}`);
        } else {
            console.log('Post ID non trovato.');
        }

        // Chiudi il browser
        await browser.close();
    } catch (error) {
        console.error('Errore:', error);
    }
}

// Sostituisci con il link del post di Instagram
const instagramLink = 'https://www.instagram.com/kurolily/p/Cc_EJ8jsIrE/';
extractPostId(instagramLink);
