const axios = require('axios');
const tools = require('../global/tools.js');

const TGAPI = { 
    get_updates: 'https://api.telegram.org/bot${token}/getUpdates?offset=${offset}',
    send_message: 'https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${text}',
}

class TGBot {
    constructor(username, token) {
        this.tgbot_username = username;
        this.tgbot_token = token;
        this.tgbot_update_offset = 0;
    }

    async run() {
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
                    console.log(error.response);
                } else {
                    console.log(error);
                }
            } finally {
                await tools.sleep(1000);
            }
        }
    }

    async onMessage(msg) {
        console.log('onMessage: ' + msg.text);
        this.sendMessage(msg.chat.id, msg.text);
    }

    async sendMessage(chatId, msg) {
        try {
            let tgapi_send_message = tools.str_replace(
                TGAPI.send_message,
                ['${token}', '${chatid}', '${text}'],
                [this.tgbot_token, chatId, msg]
            );
             await axios.get(tgapi_send_message);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = TGBot;
