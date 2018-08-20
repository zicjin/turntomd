const Winston = require('winston')
const ElasticSearch = require('winston-elasticsearch')
const config = require('./config')

const logger = Winston.createLogger({
    level: 'debug',
    transports: [
        new Winston.transports.File({ filename: 'error.log', level: 'error' }),
        new Winston.transports.Console({ format: Winston.format.simple() }),
    ],
});

if (process.env.NODE_ENV === 'production') {
    logger.add(new ElasticSearch({
        level: 'info',
        indexPrefix: config.es_prefix,
        indexSuffixPattern: 'YYYY.MM',
        messageType: '_doc',
        clientOpts: {
            host: config.es_host,
            httpAuth: config.es_account,
        },
    }))
}

logger.info('logger standby')

module.exports = logger
