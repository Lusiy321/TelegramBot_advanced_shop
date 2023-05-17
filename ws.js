const WebSocket = require("ws");

const ws = new WebSocket("wss://stream.bybit.com/realtime");

const symbols = [
  "BTCUSDT",
  "ETHUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "SOLUSDT",
  "DOTUSDT",
  "LINKUSDT",
  "LUNAUSDT",
  "AXSUSDT",
];

ws.on("open", function open() {
  for (const symbol of symbols) {
    ws.send(
      JSON.stringify({
        op: "subscribe",
        args: [`instrument_info.100ms.${symbol}`],
      })
    );
  }
});

ws.on("message", function incoming(data) {
  const message = JSON.parse(data);
  if (
    message.success === true &&
    message.topic &&
    message.topic.includes("instrument_info.100ms.")
  ) {
    console.log(
      `Symbol: ${message.topic.split(".")[2]}, Last Price: ${
        message.data.last_price
      }`
    );
  }
});

module.exports = { ws };
