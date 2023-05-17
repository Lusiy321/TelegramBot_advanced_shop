const TelegramApi = require("node-telegram-bot-api");
const axios = require("axios");
const { restart } = require("nodemon");
require("dotenv").config();

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Старт" },
  { command: "/set", description: "Задайте %" },
  { command: "/stop", description: "Остановить бот" },
]);

async function checkPriceChange(chatId, resMsg, bool) {
  if (bool === false) {
    return bot.sendMessage(chatId, `Вы остановили бот`);
  } else {
    let coins = [];

    // Получение списка монет
    const responseSymbols = await axios.get(
      "https://api.bybit.com/spot/v3/public/symbols"
    );
    if (responseSymbols.status === 200) {
      const quotes = responseSymbols.data.result.list;
      for (const coin of quotes) {
        coins.push(coin.name);
      }
    }
    while (bool) {
      try {
        for (const symbol of coins) {
          const intervalResponse = await axios.get(
            `https://api.bybit.com/spot/v3/public/quote/kline?symbol=${symbol}&interval=1m&limit=1`
          );
          if (intervalResponse.status === 200) {
            const prices = intervalResponse.data.result.list;
            if (prices === null) {
              continue;
            }
            for (const price of prices) {
              const priceChangePercent = ((price.c - price.o) / price.o) * 100;

              if (
                priceChangePercent >= resMsg ||
                priceChangePercent <= -resMsg
              ) {
                bot.sendMessage(
                  chatId,
                  `Пара: #${symbol}, Цена изменилась на: ${priceChangePercent.toFixed(
                    2
                  )}% за 1мин. Объем: ${price.v}$`
                );
                console.log(
                  `Symbol: ${symbol}, Price Change: ${priceChangePercent.toFixed(
                    2
                  )} % за 1мин. Объем: ${price.v}$`
                );
              }
            }
          }
        }
      } catch (error) {
        console.error(`For of: ${error.message}`);
      }
    }
  }
}
const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      console.log(`New user ${msg.from.first_name} connected`);
      bot.sendMessage(
        chatId,
        `Привет ${msg.from.first_name} теперь тебе будут приходить уведомления об изменении цены криптовалют биржи Bybit. Отправте коменду "/set". веедите число от 1-99 для изменения разницы в процентах.`
      );

      return;
    }

    if (text === "/set") {
      bot.sendMessage(
        chatId,
        "веедите число от 1-99 для изменения разницы в процентах."
      );
      return;
    }
    if (text === "/stop") {
      let bool = false;
      let resMsg = 1000;
      checkPriceChange(falce);
      return restart();
    }
    if (text) {
      let resMsg = parseInt(text);
      console.log(resMsg);
      if (resMsg >= 0) {
        console.log(`User ${msg.from.first_name} set ${resMsg} % value`);
        bot.sendMessage(chatId, `Вы задали ${resMsg} % зазора`);
        let bool = true;
        checkPriceChange(chatId, resMsg, bool);
        return;
      } else {
        return bot.sendMessage(chatId, `Вы задали не верное значение`);
      }
    } else {
      return bot.sendMessage(chatId, `Вы задали не верное значение`);
    }
  });
};

const date = new Date() + 2;

start();
console.log("Server started", date);
