const TelegramBot = require('node-telegram-bot-api');

class TGBot {
    constructor(username, token) {
        this.tgbot_username = username;
        this.tgbot_token = token;

        this.bot = new TelegramBot(token, {polling: true});
    }

    async run() {
        this.bot.onText(/\/echo (.+)/, (msg, match) => {
            const chatId = msg.chat.id;
            const resp = match[1];
            this.bot.sendMessage(chatId, resp);
          });
          
          this.bot.on('message', (msg) => {
            const chatId = msg.chat.id;
            this.bot.sendMessage(chatId, `Received your message, ChatId: ${chatId}`);
          });
    }

    async sendMessage(chatId, msg) {
        console.log(msg);
        await this.bot.sendMessage(chatId, msg, { parse_mode: "HTML"});
        return true;
    }
}

module.exports = TGBot;
