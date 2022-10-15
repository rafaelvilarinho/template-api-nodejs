import winston from 'winston'

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ level: 'silly' }),
  ],
});

export default logger