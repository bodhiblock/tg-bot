console.log(`APP start`);

function initLogger() {
    global.plog = require('./lib/global/log.js').createAppLogger();
    plog.info(`Logger Setup OK`)
}

function loadKoaApp() {
    const KoaApp = require('./lib/koa/koa_app.js');
    for (let k in app_config.koa_apps) {
        let koaApp = app_config.koa_apps[k];
        KoaApp.load({ name: koaApp.name, port: koaApp.port });
    }
}

function loadConfig() {
    let fs = require('fs');
    let config_default = require('./config-default.js');
    global.app_config = config_default;
    if (fs.existsSync('./config.js')) {
        let config = require('./config.js');
        for (let k in config) {
            config_default[k] = config[k];
            plog.info("Overload config: " + k);
        }
    }

    if (fs.existsSync('/config/config.js')) {
        let config = require('/config/config.js');
        for (let k in config) {
            config_default[k] = config[k];
            plog.info(`Overload GoogleCloudRun config: ${k}`);
        }
    }
}

function initMongodb() {    
    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect(app_config.mongodb, app_config.mongodb_options);
}

async function main() {
    const TGBot = require('./lib/core/tgbot.js');
    let tgbot = new TGBot(app_config.tgbot_username, app_config.tgbot_token);
    global.tg_bot = tgbot;
    tgbot.run();
}

initLogger();
loadConfig();
loadKoaApp();
//initMongodb();

main();
