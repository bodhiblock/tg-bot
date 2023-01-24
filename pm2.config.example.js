
module.exports = {
    apps : [
        {
          name: 'wallet-manager',
          script: './app.js',
          interpreter_args: '--max-old-space-size=8192',
      }
    ],
};
