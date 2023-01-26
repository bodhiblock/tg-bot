require('date-utils');
const crypto = require('crypto');
const Router = require('koa-better-router');

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

    routers.post("/tgbot/on_webhook", async (ctx, next) => {
        await global.tg_bot.onMessage(ctx.args.message);
        ctx.responseData("OK");
    });

    routers.post("/tgbot/on_tradingview_message", async (ctx, next) => {
        plog.info(JSON.stringify(ctx));
        plog.info(JSON.stringify(ctx.request));
        plog.info(JSON.stringify(ctx.args));
        await global.tg_bot.sendMessage(5734749344, ctx.args.text);
        ctx.responseData('OK');
    });

    app.use(routers.middleware());
};
