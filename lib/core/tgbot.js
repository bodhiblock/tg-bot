const { default: axios } = require('axios');
const TelegramBot = require('node-telegram-bot-api');

class TGBot {
    constructor(username, token) {
        this.tgbot_username = username;
        this.tgbot_token = token;

        this.bot = new TelegramBot(token, { polling: true });
    }

    async run() {
        this.bot.onText(/\/echo (.+)/, (msg, match) => {
            const chatId = msg.chat.id;
            const resp = match[1];
            this.bot.sendMessage(chatId, resp);
        });

        this.bot.onText(/\/myid (.+)/, (msg, match) => {
            const chatId = msg.chat.id;
            this.bot.sendMessage(chatId, `Received your message, ChatId: ${chatId}`);
        });


        this.bot.on('message', async (msg) => {
            if (msg.text.startsWith('0x') && msg.text.length == 42) {
                await axios(`https://api.g.dog/api/tg_query_token?token_contract=${msg.text}&message_id=${msg.message_id}&chat_id=${msg.chat.id}`)
            }
        });
    }

    async sendMessage(chatId, msg, options) {
        console.log(msg);
        await this.bot.sendMessage(chatId, msg, options);
        return true;
    }
}

module.exports = TGBot;
