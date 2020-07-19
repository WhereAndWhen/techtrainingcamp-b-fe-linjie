const Koa = require('koa');
const Router = require('koa-router');
const axios = require('axios')


const app = new Koa();
const router = new Router();
const kPort = 8000;

//解决跨域
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    await next();
});

router.get('/', async ctx => {
    ctx.body = 'Hello World!'
})
router.get('/sug', async ctx => {
    const keyword = ctx.request.query.keyword;
    const url = `https://i.snssdk.com/search/api/sug/?keyword=${keyword}`;
    const result = await axios.get(url);
    ctx.body = result.data;
})
router.get('/search', async ctx => {
    const keyword = ctx.request.query.keyword;
    const offset = ctx.request.query.offset || 0;
    const url = `https://i.snssdk.com/search/api/study?keyword=${keyword}&offset=${offset}`;
    const result = await axios.get(url);
    ctx.body = result.data;
})


app.use(router.routes()).use(router.allowedMethods());

app.listen(kPort, () => {
    console.log(`listening on: ${kPort}, pid: ${process.pid}`)
})