const NODE_ENV = process.env.NODE_ENV || 'development'

let config
switch (NODE_ENV) {
    case 'development':
        config = require('./dev')
        break;
    case 'test':
        config = require('./test')
        break;
    case 'production':
        config = require('./prod')
        break;
    default:
        throw new Error('config null')
}

module.exports = config
