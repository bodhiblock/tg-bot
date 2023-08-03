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

        this.bot.onText(/\/chatid/, (msg, match) => {
            const chatId = msg.chat.id;
            this.bot.sendMessage(chatId, `ChatId: ${chatId}`);
        });

        this.bot.onText(/\/start(.*)/, async (msg, match) => {
            let replyMsg = `您可以点击下方按钮打开App，或者发送合约地址查询。[ ](t.me/gdogcn_bot/app) 👌`;
            let replyOpt = {
                parse_mode: "MarkDown",
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: [[{
                        text: "📃今日榜单"
                    }, {
                        text: "👤个人中心"
                    }]]
                }
            }

            if (msg.chat.type == 'private') {

            } else {
                replyOpt.reply_to_message_id = msg.message_id;
            }

            this.bot.sendMessage(msg.chat.id, replyMsg, replyOpt);
        });

        this.bot.on('message', async (msg) => {
            if (!msg.text || msg.from.is_bot) {
                return;
            }

            if (msg.text.startsWith('0x') && msg.text.length == 42) {
                await axios(`${app_config.api_url}/api/tg_query_token?token_contract=${msg.text}&message_id=${msg.message_id}&chat_id=${msg.chat.id}`)
            }

            let addCredits = 10;
            let checkin = msg.text == '签到';
            if (checkin) {
                addCredits = 100;
            }

            await axios(`${app_config.api_url}/api/bot/add_today_credits?openid=${msg.from.id}&credits=${addCredits}&checkin=${checkin}`);

            let cmd = app_config.commands[msg.text];
            if (cmd) {
                await axios(`${app_config.api_url}/api/bot/command?openid=${msg.from.id}&cmd=${cmd}`);
            }
        });
    }

    async sendMessage(chatId, msg, options) {
        await this.bot.sendMessage(chatId, msg, options);
        return true;
    }
}

module.exports = TGBot;
