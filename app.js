
function initLogger() {
    console.log(`=========================================`);
    console.log(`APP Name:    ${process.env.npm_package_name}`);
    console.log(`APP Version: ${process.env.npm_package_version}`);
    console.log(`=========================================`);

    global.plog = require('./lib/global/log.js').createAppLogger();
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
}

function initMongodb() {    
    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect(app_config.mongodb, app_config.mongodb_options);
}

initLogger();
loadConfig();
loadKoaApp();
//initMongodb();
