function replaceString(lang, param) {

    return `<svg version="1.1" baseProfile="full" width="750" height="860" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 860">
        <defs>
            <style>
                .text_name{
                    font-size: 20px;
                    fill: #666;
                    text-anchor:  start;
                    font-weight: 400;
                }
                .text_val{
                    font-size: 26px;
                    fill: #000;
                    font-weight: 600;
                    text-anchor: end;
                }
                .border{
                    font-weight: 300;
                }
                .buy{
                    fill: #36a384;
                }
                .sell{
                    fill: #e55e7c;
                }
            </style>
        </defs>
        <rect width="100%" height="100%" fill="#8e00df" />
        <text x="10%" y="30%" rotate="-10"  font-weight="bold" font-size="400" opacity="0.1" fill="#fefefe">
            G
        </text>
        <rect width="100%" height="85%" y="15%" rx="40" ry="40"  fill="white"  />
        <rect width="100%" height="50%" y="50%" fill="white"  />
        <text x="30" y="90">
            <tspan font-weight="500" stroke-width="5" font-size="60" fill="#fff">${lang.appName}</tspan>
        </text>
    
        <path id="logo" xmlns:xlink="http://www.w3.org/2000/svg" fill="#fff" d="M543,39H708a0,0,0,0,1,0,0V74a25,25,0,0,1-25,25H518a0,0,0,0,1,0,0V64A25,25,0,0,1,543,39Z"/>
    
        <text x="545" y="85">
            <tspan fill="#8e00df" font-weight="bold" font-size="40" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#logo">
                G.DOG
            </tspan>
        </text>
    
        <text x="30" y="200">
            <tspan text-anchor="start" font-size="34" fill="#000">${param.name || '-'}(${param.symbol || '-'})</tspan>
        </text>
        
        <text x="30" y="240">
            <tspan font-size="24" fill="#666">${param.create_time || '-'}</tspan>
        </text>
    
        <text>
            <tspan class="text_name" x="30" y="300">${lang.createTime}</tspan>
            <tspan class="text_val" x="720" y="300">
                ${param.downTime}
            </tspan>
        </text>
    
        <text>
            <tspan class="text_name" x="30" y="350"  >${lang.liquidity}</tspan>
            <tspan class="text_val" x="720" y="350">${param.liquidity || '-'} WETH</tspan>
        </text>
    
        <text>
            <tspan class="text_name" x="30" y="400"  >${lang.market}</tspan>
            <tspan class="text_val" x="720" y="400">${param.total_market_cap || '-'} USD</tspan>
        </text>
    
        <text>
            <tspan class="text_name" x="30" y="450"  >${lang.holders}</tspan>
            <tspan class="text_val" x="720" y="450" >${param.holders || '-'}</tspan>
        </text>
    
        <text>
            <tspan class="text_name" x="30" y="500"  >${lang.holdersClear}</tspan>
            <tspan class="text_val" x="720" y="500" >${(param.total_holders - param.holders) || '-'}</tspan>
        </text>
    
        <text>
            <tspan class="text_name" x="30" y="550"  >${lang.tradeVolume}</tspan>
            <tspan class="text_val" x="720" y="550" >${param.txcount || '-'}</tspan>
        </text>
    
        <text>
            <tspan class="text_name" x="30" y="600"  >${lang.recently}</tspan>
            <tspan class="text_val" x="720" y="600" >
                <tspan class="buy">${param.buy_count || '-'} <tspan class="border">${lang.buy}</tspan></tspan>
                <tspan class="sell">${param.sell_count || '-'} <tspan class="border">${lang.sell}</tspan></tspan>
            </tspan>
        </text>
    
        <text>
            <tspan class="text_name" x="30" y="650"  >${lang.address}</tspan>
            <tspan class="text_val" x="720" y="650" >
                <tspan font-size="22">${param.token_contract || '-'}</tspan>
            </tspan>
        </text>
    
        <text>
            <tspan class="text_name" x="30" y="720"  >${lang.socialLife}</tspan>
        </text>
    
        ${param.links}
    
        <text>
            <tspan class="text_name" x="30" y="780"  >${lang.friends}</tspan>
            <tspan class="text_val" x="720" y="780" >${param.twitter_info && param.twitter_info.friends_count || '-'}</tspan>
        </text>
    
        <text>
            <tspan class="text_name" x="30" y="830"  >${lang.favourites}</tspan>
            <tspan class="text_val" x="720" y="830" >${param.twitter_info && param.twitter_info.favourites_count || '-'}</tspan>
        </text>
    
    </svg>`;
}
exports.replaceString = replaceString;