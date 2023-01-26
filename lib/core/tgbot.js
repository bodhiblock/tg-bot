const axios = require('axios');
const tools = require('../global/tools.js');

const TGAPI = { 
    get_updates: 'https://api.telegram.org/bot${token}/getUpdates?offset=${offset}',
    send_message: 'https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${text}',
    get_webhook_info: 'https://api.telegram.org/bot${token}/getWebhookInfo',
}

class TGBot {
    constructor(username, token) {
        this.tgbot_username = username;
        this.tgbot_token = token;
        this.tgbot_update_offset = 0;
    }

    async getWebHook() {
        while(true) {
            try {
                let tgapi_get_webhook_info = TGAPI.get_webhook_info.replace('${token}', this.tgbot_token);
                let response = await axios.get(tgapi_get_webhook_info);
                return response.data.result.url.length > 0 ? response.data.result.url : null;
            } catch(error) {
                await tools.sleep(5000);
            }
        }
    }

    async run() {
        let webhook = await this.getWebHook();
        if (webhook) {
            plog.info(`TGBot run in webhook mode, URL = ${webhook}`);
        } else {
            plog.info('TGBot run in loop mode');
        }

        while(true) {
            try { 
                let tgapi_get_updates = tools.str_replace(
                    TGAPI.get_updates,
                    ['${token}', '${offset}'],
                    [this.tgbot_token, this.tgbot_update_offset]
                );
                let response = await axios.get(tgapi_get_updates);
                if (response.data.ok && response.data.result && response.data.result.length > 0) {
                    let result = response.data.result;
                    for (let k in result) {
                        await this.onMessage(result[k].message);
                        this.tgbot_update_offset = result[k].update_id + 1;
                    }
                }
            } catch(error) {
                if (error.response) {
                    plog.error("111" + error.response.toString());
                } else {
                    plog.error("222" + error.toString());
                }
            } finally {
                await tools.sleep(1000);
            }
        }
    }

    async onMessage(msg) {
        this.sendMessage(msg.chat.id, msg.text);
    }

    async sendMessage(chatId, msg) {
        try {
            let tgapi_send_message = tools.str_replace(
                TGAPI.send_message,
                ['${token}', '${chatid}', '${text}'],
                [this.tgbot_token, chatId, msg]
            );
            let response =  await axios.get(tgapi_send_message);
            if (response && response.data && response.data.ok) {
                return true;
            } else {
                plog.error("333" + response.toString());
            }
        } catch (error) {
            plog.error("444" + error.toString());
        }
    }
}

module.exports = TGBot;
