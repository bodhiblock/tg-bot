const { shareImg } = require('shareImg/index.js');
const MsgEN = require('msg-templates/en.js')
const MsgCN = require('msg-templates/cn.js')

class Pusher {
    static LangTemplate = {
        en: MsgEN,
        cn: MsgCN,
    }

    static async pushPairMsg(pair) {
        let msgTemp = this.LangTemplate[pair.lang];
        let msg = msgTemp.constractMessage(pair);
        let options = msgTemp.constractMessageOptions(pair);

        await global.tg_bot.bot.sendMessage(pair.chat_id, msg, options);
    }

    static async pushPairImg(pair) {
        let msgTemp = this.LangTemplate[pair.lang];
        let options = msgTemp.constractMessageOptions(pair);
        let img = await shareImg(pair);
        if (img) {
            await global.tg_bot.bot.sendPhoto(pair.chat_id, img, options);
        }
    }
}

module.exports = Pusher;
