const TelegramApi = require("node-telegram-bot-api");
const token = "5735264932:AAEtBZZeNqv6jB5zMFRaZSfquyX72dLRIsc";

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Start bot" },
  { command: "/info", description: "Information" },
]);

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return bot.sendMessage(
        chatId,
        `Шо ты ${msg.from.first_name}?, голова)))`
      );
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Эта гадость работает - ${msg.from.first_name} ${msg.from.last_name} у тебя всё получилось!`
      );
    }

    return bot.sendMessage(chatId, "Напиши чтото нормальное");
  });
};

start();
