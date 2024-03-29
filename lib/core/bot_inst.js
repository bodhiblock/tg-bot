const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

class BotInstance {
    constructor(username, token) {
        this.botUsername = username;
        this.botToken = token;
        this.bot = new TelegramBot(token, { polling: true });
    }

    async init() {

    }

    async OnMessage(msg) {
        let addCredits = 10;
        let checkin = msg.text == '签到';
        if (checkin) {
            addCredits = 100;
        }

        await axios(`${app_config.api_url}/api/bot/add_today_credits?openid=${msg.from.id}&credits=${addCredits}&checkin=${checkin}`);

        let cmd = app_config.commands[msg.text];
        if (cmd) {
            await axios.post(`${app_config.api_url}/api/bot/command`, {
                openid: msg.from.id,
                message_id: msg.message_id,
                chat_id: msg.chat.id,
                bot_id: this.botUsername,
                lang: 'en',
                cmd: cmd
            });
        }
    }

    async onMessage_Address(msg) {
        try {
            await axios.post(`${app_config.api_url}/api/bot/query_token`, {
                openid: msg.from.id,
                chain_id: 1,
                token_contract: msg.text,
                message_id: msg.message_id,
                chat_id: msg.chat.id,
                bot_id: this.botUsername,
                lang: 'en',
                push_type: 'msg',
                title: '📑QueryToken📑',
                msg: ''
            })
        } catch (error) {
            plog.warn(error);
        }
    }

    async OnMessage_Start(msg) {
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
    }

    async run() {
        this.bot.onText(/\/id/, (msg, match) => {
            const chatId = msg.chat.id;
            this.bot.sendMessage(chatId, `ChatId: ${chatId}`);
        });

        this.bot.onText(/0x[a-f0-9]{40}/, async (msg, match) => {
            await this.onMessage_Address(msg);
        });

        this.bot.onText(/\/start(.*)/, async (msg, match) => {
            await this.onMessage_Start(msg);
        });

        this.bot.on('message', async (msg) => {
            if (msg.text && !msg.from.is_bot) {
                await this.OnMessage(msg);
            }
        });
    }
}

module.exports = BotInstance;
