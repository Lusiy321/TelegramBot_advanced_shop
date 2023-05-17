const TelegramApi = require("node-telegram-bot-api");
require("dotenv").config();
const token = process.env.TELEGRAM_TOKEN;
const axios = require("axios");
const { restart } = require("nodemon");

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([{ command: "/start", description: "Старт" }]);

async function checkPriceChange(chatId) {
  try {
    // Получение списка монет
    const responseSymbols = await axios.get(
      "https://api.bybit.com/spot/v3/public/symbols"
    );
    if (responseSymbols.status === 200) {
      const quotes = responseSymbols.data.result.list;
      for (const symbol of quotes) {
        try {
          const intervalResponse = await axios.get(
            `https://api.bybit.com/spot/v3/public/quote/kline?symbol=${symbol.name}&interval=1m&limit=1`
          );
          if (intervalResponse.status === 200) {
            const prices = intervalResponse.data.result.list;

            for (const price of prices) {
              const priceChangePercent = ((price.c - price.o) / price.o) * 100;

              if (priceChangePercent >= 5 || priceChangePercent <= -5) {
                bot.sendMessage(
                  chatId,
                  `Пара: #${
                    symbol.name
                  }, Цена изменилась на: ${priceChangePercent.toFixed(
                    2
                  )}% за 1мин. Объем: ${price.v}$`
                );
                console.log(
                  `Symbol: ${
                    symbol.name
                  }, Price Change: ${priceChangePercent.toFixed(2)} %`
                );
              }
            }
          }
        } catch (error) {
          console.error(`For of: ${error.message}`);
          continue;
        }
      }
    }
  } catch (error) {
    console.error(`${error.message}`);
  }
}

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      bot.sendMessage(
        chatId,
        `Привет ${msg.from.first_name} теперь тебе будут приходить уведомления об изменении цены криптовалют биржи Bybit на 5%`
      );
      console.log(`New user ${msg.from.first_name} connected`);
      checkPriceChange(chatId);
      return;
    }
    return bot.sendMessage(chatId, "Mesagge me");
  });
};

start();
