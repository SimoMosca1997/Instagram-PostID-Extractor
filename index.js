const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server attivo!");
});

app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});


