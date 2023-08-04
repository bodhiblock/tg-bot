const axios = require('axios');
const BotInstance = require('./bot_inst');

class TGBot {
    constructor() {
        this.bots = {};
    }

    async init() {
        while (true) {
            try {
                let result = await axios(`${app_config.api_url}/api/get_tgbots`);
                let bots = result.data.data;
                for (let k in bots) {
                    this.bots[k] = new BotInstance(k, bots[k]);
                    await this.bots[k].init();
                    this.bots[k].run();
                    plog.info(`Load Bot ${k}`);
                }
                break;
            } catch (error) {
                plog.warn(`Load Bot Failed, try again later ... ...`);
                await tools.sleep(10 * 1000);
            }
        }
    }

    async run() {
        
    }
}

module.exports = TGBot;
