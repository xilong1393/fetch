import winston from 'winston'

const logger =
    winston.createLogger({
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'logs/combined.log' })
        ],
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            winston.format.printf((info:any) => {
                return JSON.stringify({
                    level: info.level,
                    timestamp: info.timestamp,
                    message: info
                });
            }))
    })

const childLogger = logger.child({});

export { logger, childLogger }