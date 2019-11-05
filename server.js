require('dotenv').config();
// const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Hello World!' });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
