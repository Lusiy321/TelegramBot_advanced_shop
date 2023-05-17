const axios = require("axios");
const { bot } = require("./index");
async function checkPriceChange(chatId) {
  // Получение списка монет
  while (true) {
    let coins = [];

    const responseSymbols = await axios.get(
      "https://api.bybit.com/spot/v3/public/symbols"
    );
    if (responseSymbols.status === 200) {
      const quotes = responseSymbols.data.result.list;
      for (const coin of quotes) {
        coins.push(coin.name);
      }
    }
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

            if (priceChangePercent >= 0.1 || priceChangePercent <= -0.1) {
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
const date = new Date();

module.exports = { checkPriceChange };
