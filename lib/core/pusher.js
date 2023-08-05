const { shareImg } = require('./shareImg/index.js');
const MsgEN = require('./msg-templates/en.js')
const MsgCN = require('./msg-templates/cn.js')

class Pusher {
    static LangTemplate = {
        en: MsgEN,
        cn: MsgCN,
    }

    static async pushPairMsg(pair) {
        let msgTemp = this.LangTemplate[pair.lang];
        let msg = msgTemp.constractMessage(pair);
        let options = msgTemp.constractMessageOptions(pair);
        await TGBotManager.bots[pair.bot_id].bot.sendMessage(pair.chat_id, msg, options);
    }

    static async pushPairImg(pair) {
        let msgTemp = this.LangTemplate[pair.lang];
        let options = msgTemp.constractPhotoOptions(pair);
        let img = await shareImg(pair);
        if (img) {
            await TGBotManager.bots[pair.bot_id].bot.sendPhoto(pair.chat_id, img, options);
        }
    }

    static async pushData(pushData) {
        let msgTemp = this.LangTemplate[pushData.lang];
        let result = msgTemp[`constract_${pushData.data_type}`](pushData.data);
        await TGBotManager.bots[pushData.bot_id].bot.sendMessage(pushData.chat_id, result.message, {
            ...result.options,
            reply_to_message_id: pushData.reply_to_message_id,
        });
    }
}

module.exports = Pusher;
