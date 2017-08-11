const Koa = require('koa')
const app = new Koa()
const latest = require('./lib/latest')
const browserify = require('browserify')
const watchify = require('watchify')
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer()
const route = require('koa-route')

const { PORT } = process.env
const bundle = () =>
  new Promise((resolve, reject) => {
    browserify({
      entries: ['./lib/client/index.js'],
      cache: {},
      packageCache: {},
      plugin: [watchify]
    })
      .transform('sheetify')
      .transform('es2020')
      .bundle((err, buf) => (err ? reject(err) : resolve(buf)))
  })

app.use(
  route.get('/', async ctx => {
    const [listings, js] = await Promise.all([latest(), bundle()])
    ctx.body = `
    <html>
      <body>
        <div id="main"></div>
        <script>window.BOOTSTRAP = ${JSON.stringify(listings)}</script>
        <script>${js}</script>
      </body>
    </html>  
  `
  })
)

app.use(
  route.get('/proxy', ctx => {
    ctx.respond = false
    proxy.web(ctx.req, ctx.res, {
      target: ctx.query.target,
      changeOrigin: true
    })
  })
)

app.listen(PORT)
console.log(`Listening on ${PORT}`)
