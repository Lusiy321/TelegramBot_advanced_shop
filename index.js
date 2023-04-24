const TelegramApi = require("node-telegram-bot-api");
const order = require("./orderbook");
const token = "5735264932:AAEtBZZeNqv6jB5zMFRaZSfquyX72dLRIsc";

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
      bot.sendMessage(chatId, `Привет ${msg.from.first_name}`);

      return;
    }
    if (text === "/update") {
      order;
      bot.sendMessage(chatId, "Socket start");
      return;
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `This is work`);
    }

    return bot.sendMessage(chatId, "Mesagge me");
  });
};

start();
