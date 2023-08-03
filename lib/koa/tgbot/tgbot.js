require('date-utils');
const Router = require('koa-better-router');
const Pusher = require('../../core/pusher.js');

module.exports = function (app) {
    let routers = new Router().loadMethods();

    routers.get("/tgbot/send_message", async (ctx, next) => {
        let result = await global.tg_bot.sendMessage(ctx.args.chat_id, ctx.args.msg);
        if (result) {
            ctx.responseData('OK');
        } else {
            ctx.responseError('FAIL');
        }
    });

    routers.post("/tgbot/send_message", async (ctx, next) => {
        let result = await global.tg_bot.sendMessage(ctx.args.chat_id, ctx.args.msg, ctx.args.options);
        if (result) {
            ctx.responseData('OK');
        } else {
            ctx.responseError('FAIL');
        }
    });

    routers.post("/tgbot/send_photo", async (ctx, next) => {
        let result = await global.tg_bot.bot.sendPhoto(ctx.args.chat_id, ctx.args.url, ctx.args.options, ctx.args.file_options);
        if (result) {
            ctx.responseData('OK');
        } else {
            ctx.responseError('FAIL');
        }
    });

    routers.post("/tgbot/push_pair", async (ctx, next) => {
        if (ctx.args.push_type == 'msg') {
            await Pusher.pushPairMsg(ctx.args);
        } else if (ctx.args.push_type == 'img') {
            await Pusher.pushPairImg(ctx.args);
        }
        ctx.responseData('OK');
    });

    app.use(routers.middleware());
};
