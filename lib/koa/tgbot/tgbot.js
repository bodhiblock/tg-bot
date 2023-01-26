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
        plog.info(`onwebhook: ${JSON.stringify(ctx.data)}`);
        await global.tg_bot.onMessageUpdate(ctx.data);
        ctx.responseData("OK");
    });

    app.use(routers.middleware());
};
