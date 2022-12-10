import winston from 'winston'

const logger =
    winston.createLogger({
        transports: [
            new winston.transports.Console(),
            // new winston.transports.File({ filename: 'logs/combined.log' }),
            // new winston.transports.Http({ host: 'localhost', port: 8126 })
        ],
        level: 'info',
        exitOnError: false,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
    })

const childLogger = logger.child({});

export { logger, childLogger }