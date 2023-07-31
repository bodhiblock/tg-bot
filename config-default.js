module.exports = {
    api_secret_key: 'ofcourseistillloveyou', // API调用签名密钥
    cipher_iv: '0123456789123456',
    force_check_sign: false, // 开启API签名校验
    sign_debug: false, // 签名调试输出开关
    api_url: 'https://api.g.dog',
    commands: {
        '👤个人中心': 'my',
        '📃今日榜单': 'board',
    },
    mongodb: 'mongodb://127.0.0.1:27017/abc', // mongodb数据库配置
    mongodb_options: {
        auto_reconnect: true,
        poolSize: 2,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    },
    koa_apps: [
        {
            name: 'tgbot',
            host: '0.0.0.0',
            port: 8111,
        },
    ],
};
