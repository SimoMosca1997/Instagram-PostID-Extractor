const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Servire il file HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});


