module.exports = class {
    static BooleanFlag = {
        true: '✅',
        false: '⚠️',
    }

    static Pipeline = [
        'base_info',
        'audit_info',
        'twitter_info',
        'twitter_related',
        'extra_info'
    ]

    static base_info(pair) {
        return `
*${pair.title}*
🔊 ${pair.name}(${pair.symbol})
🕒 ${tools.calcDateDiff(new Date(pair.create_time))}
💰 Price: *$${tools.formatPrice(pair.price)}* | MCap: *$${tools.formatNumber(pair.total_market_cap)}*
🔹 Liquidity: *${tools.formatNumber(pair.liquidity)} WETH*
🔹 Swap: *${tools.formatNumber(pair.buy_count)} Buy* | *${tools.formatNumber(pair.sell_count)} Sell*
🔹 Holders: *${tools.formatNumber(pair.holders)}* | Txs: *${tools.formatNumber(pair.txcount)}*
🌀 Top10: *${parseInt(pair.extra_info.token_top10_p * 100)}%* | Pool: *${parseInt(pair.extra_info.token_pool_p * 100)}%*
🔒 LPLock: *${parseInt(pair.extra_info.lp_lock_p * 100)}%* | TokenLock: *${parseInt(pair.extra_info.token_lock_p * 100)}%*`
    }

    static extra_info(pair) {
        return `
[  ](t.me/gdogcn_bot/app?startapp=tokendetail-${pair.token_contract})
\`${pair.token_contract}\`
`
    }

    static audit_info(pair) {
        if (!pair.audit_info) {
            return
        }

        let opensource = !!pair.audit_info.opensource;
        let owner = pair.audit_info.owner_status == 'dropped';
        let honeypot = !pair.audit_info.is_honeypot;

        return `

${this.BooleanFlag[opensource]}OpenSource ${this.BooleanFlag[owner]}Owner ${this.BooleanFlag[honeypot]}Honeypot
🔹 Tax: *${parseInt(pair.audit_info.tax_buy)}%* | *${parseInt(pair.audit_info.tax_sell)}%*`
    }

    static twitter_info(pair) {
        if (!pair.twitter_info || !pair.twitter_info.created_at) {
            return
        }

        return `

🌀 *Offical Twitter*
🔹 Joined: ${tools.calcDateDiff(new Date(pair.twitter_info.created_at))} | *${tools.formatNumber(pair.twitter_info.followers_count)}* Followers
🔹 *${tools.formatNumber(pair.twitter_info.statuses_count)}* Tweets | ${tools.formatNumber(pair.twitter_info.friends_count)} Following | ${tools.formatNumber(pair.twitter_info.favourites_count)} Fav`;
    }

    static twitter_related(pair) {
        if (!pair.twitter_related || !pair.twitter_related.related_count) {
            return
        }

        return `

🌀 *Related Twitter*
🔹 Tweets: ${pair.twitter_related.related_count} | ${tools.calcDateDiff(new Date(pair.twitter_related.first_time))}
🔹 Cover: *${tools.formatNumber(pair.twitter_related.followers_count)} People*
🔹 ${pair.twitter_related.retweet_count} ReTweet | ${pair.twitter_related.favorite_count} Favorite`
    }

    static constractMessage(pair) {
        let msgList = [];
        for (let i in this.Pipeline) {
            let method = this.Pipeline[i];
            let msg = this[method](pair);
            if (msg) {
                msgList.push(msg);
            }
        }

        return msgList.join("");
    }

    static constractMessageOptions(pair) {
        let links = [];
        if (pair.links) {
            if (pair.links.twitter) {
                links.push({
                    "text": "🐦Twitter",
                    "url": pair.links.twitter
                })
            }
            if (pair.links.telegram) {
                links.push({
                    "text": "✈️Telegram",
                    "url": pair.links.telegram
                })
            }
            if (pair.links.website) {
                links.push({
                    "text": "🌐Web",
                    "url": pair.links.website
                })
            }
        }

        return {
            parse_mode: "MarkDown",
            reply_to_message_id: pair.reply_to_message_id,
            reply_markup: {
                inline_keyboard: [
                    links,
                    [{
                        "text": "📡DexTools",
                        "url": `https://www.dextools.io/app/en/ether/pair-explorer/${pair.pair_contract}`
                    }, {
                        "text": "🐣Details",
                        "url": `t.me/gdogcn_bot/app?startapp=tokendetail-${pair.token_contract}`
                    }]
                ]
            }
        }
    }

    static constractPhotoOptions(pair) {
        return {
            parse_mode: "MarkDown",
            reply_to_message_id: pair.reply_to_message_id,
            caption: `\`${pair.token_contract}\`${pair.msg ? '\n' + pair.msg : ''}`,
            reply_markup: {
                inline_keyboard: [[
                    {
                        "text": "📡DexTools",
                        "url": `https://www.dextools.io/app/en/ether/pair-explorer/${pair.pair_contract}`
                    }, {
                        "text": "🐣Details",
                        "url": `t.me/gdogcn_bot/app?startapp=tokendetail-${pair.token_contract}`
                    }
                ]]
            }
        }
    }

    static constract_hot(data) {

    }

    static constract_summary(data) {
        for (let i in data) {
            for (let k in data[i]) {
                data[i][k] = data[i][k].padStart(3);
            }
        }

        return {
            message: `📊 Market Summary 📊
\`\`\`
┌──────┬─────────────────┐
│G.DOG │ 1H    4H    24H │
├──────┼─────────────────┤
│ New  │ ${data[0].total_count}   ${data[1].total_count}   ${data[2].total_count} │
│ 2x   │ ${data[0].x2_count}   ${data[1].x2_count}   ${data[2].x2_count} │
│ 10x  │ ${data[0].x10_count}   ${data[1].x10_count}   ${data[2].x10_count} │
│ 100x │ ${data[0].x100_count}   ${data[1].x100_count}   ${data[2].x100_count} │
│ RUG  │ ${data[0].rug_count}   ${data[1].rug_count}   ${data[2].rug_count} │
│ Live │ ${data[0].live_count}   ${data[1].live_count}   ${data[2].live_count} │
└──────┴─────────────────┘
\`\`\`
`,
            options: {
                parse_mode: "MarkDown",
            }
        }
    }
}
