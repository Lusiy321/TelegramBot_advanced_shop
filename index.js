const TelegramApi = require("node-telegram-bot-api");
require("dotenv").config();
const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Старт" },
  { command: "/info", description: "Информация о товаре" },
  { command: "/update", description: "Информация" },
]);

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return bot.sendMessage(chatId, `Привет ${msg.from.first_name}`);
    }
    return bot.sendMessage(chatId, "Mesagge me");
  });
};

start();
