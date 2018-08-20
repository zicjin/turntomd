const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const TurndownService = require('turndown')

const logger = require('./logger')
const Consul = require('./consul')

Consul.Initialize()
Consul.Register()

const app = new Koa()
app.use(bodyParser({
    onerror (err, ctx) {
        ctx.throw(`body parse error:${err}`, 422)
    },
}))

const router = new Router()

router.post('/tomd', async (ctx, next) => {
    try {
        const { html } = ctx.request.body
        const turndownService = new TurndownService()
        const markdown = turndownService.turndown(html)
        ctx.status = 200
        ctx.boby = markdown
        await next();
    } catch (err) {
        logger.error('app error', { err, ctx })
        ctx.throw(err.status || 500, err.message);
    }
})

app.use(router.routes())
    .use(router.allowedMethods())


app.listen(5005)
