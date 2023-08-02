
module.exports = {
    apps : [
        {
          name: 'tgbot',
          script: './app.js',
          interpreter_args: '--max-old-space-size=8192',
      }
    ],
};
