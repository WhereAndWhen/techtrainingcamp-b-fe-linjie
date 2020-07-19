const Koa = require('koa');
const Router = require('koa-router');
const React = require('react');
const ReactDOMServer = require('react-dom/server')
const App = require('./src/App');

const app = new Koa();
const router = new Router();
const kPort = 8000;

// router.get('/', async ctx => {
//     const html = ReactDOMServer.renderToString(React.createElement(App, {}));
//     ctx.set('Content-type', 'text/html');
//     ctx.body = html;
// })

router.get('/index', async ctx => {
    ctx.body = 'Hello World!'
})


app.use(router.routes()).use(router.allowedMethods());

app.listen(kPort, () => {
    console.log(`listening on: ${kPort}, pid: ${process.pid}`)
})