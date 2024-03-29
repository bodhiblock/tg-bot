﻿require('date-utils');
const Router = require('koa-better-router');
const Pusher = require('../../core/pusher.js');

module.exports = function (app) {
    let routers = new Router().loadMethods();
    routers.post("/tgbot/send_message", async (ctx, next) => {
        let result = await TGBotManager.bots[ctx.args.bot_id].bot.sendMessage(ctx.args.chat_id, ctx.args.msg, ctx.args.options);
        if (result) {
            ctx.responseData('OK');
        } else {
            ctx.responseError('FAIL');
        }
    });

    routers.post("/tgbot/send_photo", async (ctx, next) => {
        let result = await TGBotManager.bots[ctx.args.bot_id].bot.sendPhoto(ctx.args.chat_id, ctx.args.url, ctx.args.options, ctx.args.file_options);
        if (result) {
            ctx.responseData('OK');
        } else {
            ctx.responseError('FAIL');
        }
    });

    routers.post("/tgbot/push_pair", async (ctx, next) => {
        plog.info(`PushPair ${ctx.args.token_contract} ${ctx.args.bot_id} ${ctx.args.chat_id}`);
        if (ctx.args.push_type == 'msg') {
            await Pusher.pushPairMsg(ctx.args);
        } else if (ctx.args.push_type == 'img') {
            await Pusher.pushPairImg(ctx.args);
        }
        ctx.responseData('OK');
    });

    routers.post("/tgbot/push_data", async (ctx, next) => {
        await Pusher.pushData(ctx.args);
        ctx.responseData('OK');
    });

    app.use(routers.middleware());
};
