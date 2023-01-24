module.exports = function () {
    return async function (ctx, next) {
        if (ctx.app.ready || ctx.request.url.startsWith('/init?')) {
            await next();
        } else {
            ctx.responseError('not ready');
        }
    }
};
