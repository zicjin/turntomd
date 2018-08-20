const config = require('./config')
const logger = require('./logger')
const _ = require('lodash')
const shortid = require('shortid')
const consullib = require('consul')

function fromCallback(fn) {
    return new Promise((resolve, reject) => {
        try {
            return fn((err, data, res) => {
                if (err) {
                    logger.error(err)
                    return reject(err)
                }
                return resolve(data)
            });
        } catch (err) {
            logger.error(err)
            return reject(err)
        }
    })
}

let Consul = {}

function Initialize() {
    Consul = consullib({
        promisify: fromCallback,
        host: config.consul_host,
        defaults: {
            token: config.consul_token,
        },
    })
}

async function KvGet(key) {
    const data = await Consul.kv.get(key)
    if (_.isEmpty(data) || _.isEmpty(data.Value)) {
        logger.error('KvGet null:', { key })
        return null
    }
    return data.Value
}

function KvGetWatch(key, callback) {
    const watcher = Consul.watch({
        method: Consul.kv.get,
        options: { key, token: config.consul_token },
    })

    watcher.on('change', async (data, res) => {
        if (!data || _.isEmpty(data.Value)) {
            logger.error('KvGetWatch null:', { key })
            return
        }
        logger.warn(`KvGetWatch change:${data.Value}`)
        await callback(data.Value)
    })

    watcher.on('error', (err) => {
        logger.error(`KvGetWatch error:${err}`, { key })
    })
}

async function KvSet(key, val) {
    const result = await Consul.kv.set(key, val)
    return result
}

// https://github.com/tlhunter/consul-haproxy-example/blob/master/service-data.js
const SERVICE_ID = shortid.generate()
function Register() {
    Consul.agent.service.register({
        name: 'turntomd',
        id: SERVICE_ID,
        address: config.serviceAddress,
        port: 5001,
        check: {
            ttl: '15s',
            deregister_critical_service_after: '1m',
            // http: `http://${config.serviceAddress}:5001`,
            // interval: '15s',
        },
    }, (err) => {
        if (err) throw err
        setInterval(() => {
            Consul.agent.check.pass({ id: `service:${SERVICE_ID}` }, (perr) => {
                if (perr) throw perr
            })
        }, 10 * 1000)

        process.on('SIGINT', () => {
            const details = { id: SERVICE_ID }
            Consul.agent.service.deregister(details, (serr) => {
                process.exit()
            })
        })
    })
}

module.exports = {
    Initialize,
    Consul,
    Register,
    KvGet,
    KvGetWatch,
    KvSet,
}
