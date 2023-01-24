module.exports = function () {
    return async function (ctx, next) {
        if (ctx.req.method == "POST") {
            if (typeof(ctx.request.body) == "object") {
                ctx.args = ctx.request.body;
            } else {
                try {
                    ctx.args = JSON.parse(ctx.request.body);
                }
                catch (error) {

                }
            }
        }
        else {
            ctx.args = ctx.query;
        }

        ctx.responseError = (desc, code = 1) => {
            ctx.body = { error_code: code, error: desc };
            return false;
        }

        ctx.responseData = (data) => {
            ctx.body = { error_code: 0, data: data };
        }

        await next();
    }
};
