require('date-utils');
const crypto = require('crypto');
const Router = require('koa-better-router');
const { shareImg } = require('../../core/shareImg/index.js');

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
        console.log(ctx.args)
        let result = await global.tg_bot.bot.sendPhoto(ctx.args.chat_id, ctx.args.url, ctx.args.options, ctx.args.file_options);
        if (result) {
            ctx.responseData('OK');
        } else {
            ctx.responseError('FAIL');
        }
    });

    // TODO: 定时清理过期cache
    routers.post("/tgbot/push_pair", async (ctx, next) => {
        let cache = global.tg_bot.imgCache[ctx.args.token_contract];
        let img;
        if (cache && Date.now() - cache.timestamp < 10 * 1000) {
            img = cache.img;
        } else {
            img = await shareImg(ctx.args);
            if (img) {
                global.tg_bot.imgCache[ctx.args.token_contract] = {
                    img,
                    timestamp: Date.now()
                }
            }
        }

        if (img) {
            await global.tg_bot.bot.sendPhoto(ctx.args.chat_id, img, ctx.args.options);
        }

        ctx.responseData('OK');
    });

    app.use(routers.middleware());
};
