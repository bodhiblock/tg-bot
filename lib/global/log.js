const winston = require('winston');

module.exports = class {
    static createAppLogger() {
        const logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json()
            ),
            //defaultMeta: { service: 'your-service-name' },
            transports: [
                new winston.transports.File({ filename: 'logs/program.log' }),
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            ]
        });

        if (process.platform == 'darwin') {
            logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }));
        } else {
            new winston.transports.Console()
        } 

        return logger;
    }
}
