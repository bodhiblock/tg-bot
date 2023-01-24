const fs = require('fs');
const Koa = require('koa');
const jsonResponse = require('koa-json');
const bodyParser = require('koa-bodyparser');

const ExceptionHandler = require('./middleware/exception-handler.js');
const Init = require('./middleware/init.js');
const Arguments = require('./middleware/arguments.js');
const Signature = require('./middleware/signature.js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

class KoaApp{
    static load(config) {
        if (global.koa_apps == null) {
            global.koa_apps = {};
        }
        if (global.koa_apps[config.name]) {
            return global.koa_apps[config.name];
        } else {
            global.koa_apps[config.name] = new KoaApp(config);
            return global.koa_apps[config.name];
        }
    }

    constructor(config) {
        plog.info(`Koa Load App ${config.name} ... ...`)
        this.app = new Koa();
        let app = this.app;
        app.on('error', function (error, ctx) {
            //客户端断开连接不需要处理
            if (error.code == "ECONNRESET") {
                return;
            }
            plog.error('server error url = ', ctx.originalUrl);
            if (error.stack) {
                plog.error(error.stack);
            } else {
                plog.error(error.toString());
            }
        });
        
        app.use(ExceptionHandler());
        app.use(bodyParser());
        app.use(jsonResponse());
        
        app.use(Init());
        app.use(Arguments());
        app.use(Signature());

        let fileList = fs.readdirSync(`./lib/koa/${config.name}`);
        
        for (let i in fileList) {
            let file = `./${config.name}/${fileList[i]}`;
            plog.info(`Koa Load App ${config.name} ${fileList[i]} ... ...`)
            require(file)(app);
        }
        
        try {
            app.listen(config.port, config.host);
            app.ready = true;
            plog.info(`Koa Load App ${config.name} at Port: ${config.port} ... ... [OK]`);
        } catch (err) {
            if (err.stack) {
                plog.error(err.stack);
                if (settings.debug) {
                    console.error(err.stack);
                }
            }
        
            plog.error(err.toString());
            if (settings.debug) {
                console.error(err.toString());
            }
            process.exit(-1);
        }
    }
}

module.exports = KoaApp;
