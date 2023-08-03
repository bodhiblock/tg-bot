module.exports = class {
    static BooleanFlag = {
        true: '✅',
        false: '❌',
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
${pair.title}
${pair.name}(${pair.symbol})
Timestamp: ${create_time}
Price: ${total_market_cap}
MarketCap: ${total_market_cap}
Liquidity:
Buy/Sell: 
Holders:
Top10:
LockLP:`
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

        let opensource = pair.audit_info.opensource;
        let owner = pair.audit_info.owner_status == 'dropped';
        let honeypot = pair.audit_info.is_honeypot;

        return `
*Audit*
${this.BooleanFlag[opensource]}OpenSource ${this.BooleanFlag[owner]}Owner ${this.BooleanFlag[honeypot]}Honeypot
Tax: ${parseInt(pair.audit_info.tax_buy)}% / ${parseInt(pair.audit_info.tax_sell)}%`
    }

    static twitter_info(pair) {
        if (!pair.twitter_info) {
            return
        }

        return `
*Offical Twitter*
Joined: ${tools.formatDateDiff(new Date(pair.twitter_info.created_at))}
${tools.formatNumber(pair.twitter_info.followers_count)}Followers ${tools.formatNumber(pair.twitter_info.friends_count)}Following ${tools.formatNumber(pair.twitter_info.statuses_count)}Tweets ${tools.formatNumber(pair.twitter_info.favourites_count)}Fav`;
    }

    static twitter_related(pair) {
        if (!pair.twitter_related) {
            return
        }

        return `
*Related Twitter*
Tweets: ${pair.twitter_related.related_count}（${tools.formatDateDiff(pair.twitter_related.first_time)}）
${pair.twitter_related.retweet_count}ReTweet ${pair.twitter_related.favorite_count}Fav ${tools.formatNumber(pair.twitter_related.followers_count)}Cover`;
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
        return {
            parse_mode: "MarkDown",
            reply_markup: {
                inline_keyboard: [[
                    {
                        "text": "📡DexTools",
                        "url": `https://www.dextools.io/app/en/ether/pair-explorer/${pair.pair_contract}`
                    }, {
                        "text": "🐣详细信息",
                        "url": `t.me/gdogcn_bot/app?startapp=tokendetail-${pair.token0_contract}`
                    }
                ]]
            }
        }
    }
}
