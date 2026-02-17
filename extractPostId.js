const puppeteer = require('puppeteer');

async function extractMediaId(instagramUrl) {
    if (!instagramUrl) {
        console.log('URL non fornito!');
        return;
    }

    let browser;

    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // User agent realistico (molto importante con Instagram)
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        await page.goto(instagramUrl, { waitUntil: 'networkidle2' });

        // Estrai il JSON di __NEXT_DATA__
        const jsonData = await page.evaluate(() => {
            const script = document.querySelector('#__NEXT_DATA__');
            return script ? script.innerText : null;
        });

        if (!jsonData) {
            console.log('Impossibile trovare __NEXT_DATA__');
            return;
        }

        const data = JSON.parse(jsonData);

        // Qui cerchiamo il media_id in modo dinamico
        const mediaId = findMediaId(data);

        if (mediaId) {
            console.log(`Media ID trovato: ${mediaId}`);
        } else {
            console.log('Media ID non trovato.');
        }

    } catch (error) {
        console.error('Errore:', error);
    } finally {
        if (browser) await browser.close();
    }
}

/**
 * Cerca ricorsivamente media_id dentro l'oggetto JSON
 */
function findMediaId(obj) {
    if (typeof obj !== 'object' || obj === null) return null;

    if (obj.media_id) return obj.media_id;

    for (const key in obj) {
        const result = findMediaId(obj[key]);
        if (result) return result;
    }

    return null;
}

const instagramLink = 'https://www.instagram.com/kurolily/p/Cc_EJ8jsIrE/';
extractMediaId(instagramLink);

