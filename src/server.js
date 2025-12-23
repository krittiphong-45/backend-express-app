import express from "express";

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Bro! I am your server!')
});

app.listen(3000, () => {
  console.log(`Server running on port 3000`)
});