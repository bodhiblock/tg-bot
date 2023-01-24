require('date-utils');
const crypto = require('crypto');
const Router = require('koa-better-router');

module.exports = function (app) {
    let routers = new Router().loadMethods();

    routers.get("/startup", async (ctx, next) => {
        ctx.body = "OK";
    });

    routers.get("/aes", async (ctx, next) => {
        let str = ctx.args.str;
        let secret = ctx.args.secret;
        ctx.body = tools.aesEncrypt(str, secret);
    });

    routers.get("/init", async (ctx, next) => {
        if (settings.inited) {
            ctx.body = "Already initialized";
            return;
        }

        let secret = ctx.args.secret;
        Blockchain.unlock(secret);
        ctx.body = "OK";
    });

    app.use(routers.middleware());
};
