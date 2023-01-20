const TelegramApi = require("node-telegram-bot-api");
const token = "5735264932:AAEtBZZeNqv6jB5zMFRaZSfquyX72dLRIsc";

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Start bot" },
  { command: "/info", description: "Information" },
]);

bot.on("message", (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === "/start") {
    bot.sendMessage(chatId, "А Лизка, сладкая киска)))");
  }

  if (text === "/info") {
    bot.sendMessage(
      chatId,
      `Эта гадость работает ${msg.from.first_name} ${msg.from.last_name}`
    );
  }
});
