// This line fixes the deprecation warning
// https://github.com/yagop/node-telegram-bot-api/issues/319
// https://github.com/yagop/node-telegram-bot-api/issues/540
process.env.NTBA_FIX_319 = 1; // must be on top
require('dotenv').config();
// const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const validator = require('validator');
const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
// Heroku routes from port :443 to $PORT
// Add URL of your app to env variable or enable Dyno Metadata
// to get this automatically
// See: https://devcenter.heroku.com/articles/dyno-metadata
const url = process.env.APP_URL || 'https://tg-bot-sdcrop.herokuapp.com:443';

const options = {
  webHook: {
    // Port to which you should bind is assigned to $PORT variable
    // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
    port: process.env.PORT,
    // you do NOT need to set up certificates since Heroku provides
    // the SSL certs already (https://<app-name>.herokuapp.com)
    // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
  },
};

const bot = new TelegramBot(TOKEN);

process.env.NODE_ENV === 'production' ? startProdMode(bot) : process.exit(1);

async function startDevMode(bot) {
  try {
    await bot.deleteWebHook();
    await bot.startPolling();
  } catch (e) {
    console.log('startDevMode', { e });
  }
}

async function startProdMode(bot) {
  try {
    // This informs the Telegram servers of the new webhook.
    await bot.setWebHook(`${url}/bot${TOKEN}`, options);

    const webhookStatus = await bot.getWebHookInfo();
    console.log('Webhook status', webhookStatus);
  } catch (e) {
    console.log('startProdMode', { e });
  }
}

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = typeof match.input === 'string' && match.input.split(' ')[1]; // the captured value after '/start'
  if (!userId || !validator.isMongoId(userId)) {
    const text = `Hello, ${msg.from.first_name} \nIf you are a new user, Sign in to MSQ platform. Connect your account to our bot and get notifications about running strategies`;
    bot.sendMessage(chatId, text);
    return;
  }
  bot.sendMessage(
    chatId,
    `Hello, ${msg.from.first_name} \nYour account  is successfully connected to our bot. Now you can recieve notifications about your running strategies`
  );
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Hello World!' });
});

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
  console.log('hooked', { b: req.body });
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Just to ping!
bot.on('message', function onMessage(msg) {
  bot.sendMessage(msg.chat.id, 'I am alive on Heroku!');
});

app.listen(process.env.PORT || 8000, () => {
  console.log('Example app listening on port 3000!');
});
