let { shareImg } = require('./index')
let t = {
    bot_id: 0,
    lang: 'en',
    chat_id: -1001560943991,
    symbol: 'ICE',
    name: 'ICE',
    token_contract: '0x890a3a3e648e3cb345a8bd4e06878351e1c93f15',
    title: '创世新币',
    create_time: '2023-07-31T12:20:47.000Z',
    total_market_cap: 9918,
    price: 0.000009918572141355937,
    liquidity: 3.9957446176515643,
    buy_count: 14,
    sell_count: 1,
    holders: 14,
    total_holders: 16,
    txcount: 16,
    audit_info: {
        opensource: true,
        tax_buy: 0,
        tax_sell: 0.5976352755200698,
        is_honeypot: 0,
        owner_status: 'dropped',
        owner: '0x0000000000000000000000000000000000000000'
    }
}

const fs = require("fs")

async function f() {
    console.time('程序运行时间');
    let img = await shareImg(t);
    fs.writeFileSync(__dirname + "/a.png", img);
    console.timeEnd('程序运行时间');
}


f();
setTimeout(() => {
    f();
}, 6000);