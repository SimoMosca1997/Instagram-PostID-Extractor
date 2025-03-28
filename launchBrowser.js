const puppeteer = require("puppeteer");

// Lancia Puppeteer con i flag necessari
async function launchBrowser() {
  return puppeteer.launch({
    headless: true, // Usa Puppeteer in modalità headless (nessuna interfaccia grafica)
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Flag per l'ambiente di produzione
  });
}

module.exports = launchBrowser;
