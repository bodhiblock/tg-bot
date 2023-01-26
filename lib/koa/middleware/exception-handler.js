const util = require('util');
module.exports = function() {
    return async function(ctx, next) {
        try {
            await next();
        } catch(err) {
            if(util.isNumber(err)) {
                ctx.body = {error_code : err};
            } else {
                ctx.body = {error_code : 500};

                plog.error(`Requst Exception: ${JSON.stringify(err)}`);

                if (ctx.args) {
                    plog.error(`Request Exception Args: ${JSON.stringify(ctx.args)}`);
                }

                if(err.stack) {
                    plog.error(`Request Exception Stack: ${err.stack}`);
                }
            }
        }
    };
};
