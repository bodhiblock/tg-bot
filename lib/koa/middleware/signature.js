module.exports = function () {
    return async function (ctx, next) {
        if (ctx.app.ready) {
            let pos = ctx.originalUrl.indexOf('?');
            let url = ctx.originalUrl;
            if (pos != -1) {
                url = url.substr(0, pos);
            }

            let signResult = {};
            if (ctx.args.sign) {
                signResult = tools.checkSign(url, ctx.args);
            }

            if (!signResult.result) {
                if (app_config.force_check_sign) {
                    plog.info("SIGNFAIL " + url + ", " + JSON.stringify(ctx.args));
                    if (app_config.sign_debug) {
                        ctx.body = {error_code : error_code.E_SIGN_ERROR, sign: signResult.sign };
                    } else {
                        ctx.body = {error_code : error_code.E_SIGN_ERROR };
                    }
                    return false;
                }
            }
        }

        await next();
    }
};
