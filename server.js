require('dotenv').config();
// const axios = require('axios');
const express = require('express');

const app = express();
const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Hello World!' });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
