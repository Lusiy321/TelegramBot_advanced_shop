const axios = require("axios");
const { bot } = require("./index");

async function checkPriceChange(bool) {
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
        // Запрос всех пар
        for (const symbol of coins) {
          const intervalResponse = await axios.get(
            `https://api.bybit.com/spot/v3/public/quote/kline?symbol=${symbol}&interval=1m&limit=5`
          );
          if (intervalResponse.status === 200) {
            const prices = intervalResponse.data.result.list;

            if (prices === null) {
              continue;
            }
            // Расчет разницы в процентах
            for (const price of prices) {
              const priceChangePercent = ((price.c - price.o) / price.o) * 100;
              const priceChangeLow = ((price.l - price.o) / price.o) * 100;
              const priceChangeHi = ((price.h - price.o) / price.o) * 100;
              if (
                priceChangePercent >= 2 ||
                priceChangePercent <= -2 ||
                priceChangeLow >= 2 ||
                priceChangeLow <= -2 ||
                priceChangeHi >= 2 ||
                priceChangeHi <= -2
              ) {
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
const date = new Date();
console.log(checkPriceChange(true), date);
