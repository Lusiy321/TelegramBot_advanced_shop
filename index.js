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
        `Hello ${msg.from.first_name}, how are you?)))`
      );
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `This is work - ${msg.from.first_name} ${msg.from.last_name}`
      );
    }

    return bot.sendMessage(chatId, "Mesagge me");
  });
};

start();
