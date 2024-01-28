const TelegramApi = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
const fs = require("fs");
const { coin } = require("./coin");

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Старт" },
  { command: "/set", description: "изменить значение в %" },
  { command: "/stop", description: "Остановить бот" },
]);

async function checkPriceChange(chatId, resMsg, bool) {
  const coins = coin;
  console.log(bool);
  try {
    // Получение списка монет
    const responseSymbols = await axios.get(
      "https://api.bybit.com/spot/v3/public/symbols"
    );

    if (responseSymbols.status === 200) {
      const quotes = responseSymbols.data.result.list;
      coins.push(...quotes.map((coin) => coin.name));
    }

    // Запрос всех пар
    do {
      for (const symbol of coins) {
        const intervalResponse = await axios.get(
          `https://api.bybit.com/spot/v3/public/quote/kline?symbol=${symbol}&interval=1m&limit=1`
        );

        if (intervalResponse.status === 200) {
          const prices = intervalResponse.data.result.list;

          // Проверка, что prices.list не пуст и имеет необходимые свойства
          if (prices && prices.length > 0) {
            for (const price of prices) {
              const priceChangePercent = ((price.h - price.o) / price.o) * 100;

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
              }
            }
          }
        }
      }
    } while (bool);
    bot.sendMessage(chatId, `Выполнение запросов окончено`);
    console.log("Killed");
  } catch (error) {
    console.error(`For of: ${error.message}`);
  }
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  console.log(`New user ${msg.from.first_name} connected`);
  bot.sendMessage(
    chatId,
    `Привет ${msg.from.first_name} теперь тебе будут приходить уведомления об изменении цены криптовалют биржи Bybit. Отправте число от 1-99 для изменения разницы в процентах.`
  );
});

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text) {
    const resMsg = parseInt(text);
    if (resMsg >= 1) {
      console.log(`User ${msg.from.first_name} set ${resMsg} % value`);
      let bool = true;
      checkPriceChange(chatId, resMsg, bool);
      bot.sendMessage(chatId, `Вы задали ${resMsg} % зазора`);
      return;
    }
    return;
  }
});

bot.onText(/\/stop/, async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  if (text === "/stop") {
    console.log("Bot stop");
    checkPriceChange(chatId, 100, false);
    bot.sendMessage(chatId, `Вы отключили бот`);
    return;
  }
});

const date = new Date() + 2;

console.log("Server started", date);
