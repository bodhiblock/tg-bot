const svg2img = require('svg2img');
const fs = require('fs');
const { replaceString} = require('./svgString.js');
const {lang} = require('./lang.js');
const { Resvg } = require('@resvg/resvg-js');

function getTimeComponentsFromTimestamp(timestamp) {
    const millisecondsPerMinute = 60000;
    const millisecondsPerHour = 3600000;
    const millisecondsPerDay = 86400000;

    const date = new Date(timestamp);
    timestamp = Date.now() - date.getTime();
    const days = Math.floor(timestamp / millisecondsPerDay);

    const remainingMilliseconds = timestamp % millisecondsPerDay;

    const hours = Math.floor(remainingMilliseconds / millisecondsPerHour);

    const remainingMillisecondsAfterHours = remainingMilliseconds % millisecondsPerHour;

    const minutes = Math.floor(remainingMillisecondsAfterHours / millisecondsPerMinute);

    return {
        days,
        hours,
        minutes
    };
}

function downStr (create_time, param){
    let localLang = {};
    if(lang[param.lang]){
        localLang = lang[param.lang];
    }else{
        localLang = lang.zh;
    }
    let downTime = getTimeComponentsFromTimestamp(create_time);
    let downStr = `
        ${downTime.days || 0}<tspan class="border">${localLang.day}</tspan>
        ${downTime.hours || 0}<tspan class="border">${localLang.hours}</tspan>
        ${downTime.minutes || 0}<tspan class="border">${localLang.minutes}${localLang.before}</tspan>
    `;

    return downStr;
}

function fromLinks (links){
    if(!!! links) return '';
    let str = [];
    let strArray = {
        website: `<g transform="translate({x}, 680)" opacity="0.8">
            <svg width="45" height="45" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M573.461 320.60799969l-20.01100031-17.53099969c-0.05899969-0.05800031-0.17500031-0.11599969-0.26299969-0.17500031l-41.53600031-36.27100032-50.39299969 44.592L151.07100031 582.71l0 166.068 0 145.317c0 43.01899969 35.11399969 77.904 78.38500032 77.904l172.46899968 0L401.92500031 721.877c0-25.79299969 21.045-46.719 47.02699969-46.719l125.412 0c25.98199969 0 47.04199969 20.92600031 47.04199969 46.719L621.40599969 972.00000031l172.46899968 0c43.28500031 0 78.38500031-34.88599969 78.38500032-77.904L872.25999969 748.196 872.25999969 582.098 574.364 321.395 573.461 320.60799969z" fill="#1296db" p-id="2798"></path><path d="M960.72300031 424.02900031l-88.46299968-77.43799969 0-169.96000031c0-34.42000031-28.08-62.32699969-62.71399969-62.32699969-34.63300031 0-62.71300031 27.90700031-62.71300031 62.32699969l0 60.18499969L553.44999969 67.54200031c-23.71099969-20.72200031-59.21800031-20.72200031-82.899 0L63.26400031 424.02900031c-25.99699969 22.73200031-28.50199969 62.12299969-5.607 87.945 22.90999969 25.82299969 62.52400031 28.33099969 88.50700032 5.56699969L512 197.35299969l365.853 320.18800031c11.913 10.43500031 26.682 15.56299969 41.41999969 15.56299969 17.38999969 0 34.692-7.14100031 47.07100031-21.13000032C989.23899969 486.137 986.73399969 446.762 960.72300031 424.02900031z" fill="#1296db"></path></svg>
        </g>`,
        twitter: `<g transform="translate({x}, 680)" opacity="0.8">
            <svg width="45" height="45" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C228.430769 0 0 228.430769 0 512s228.430769 512 512 512 512-228.430769 512-512S795.569231 0 512 0z m248.123077 366.276923c-3.938462 3.938462-3.938462 7.876923-7.876923 7.876923-7.876923 7.876923-15.753846 11.815385-23.630769 15.753846-3.938462 0-3.938462 3.938462-3.938462 7.876923 3.938462 43.323077-3.938462 86.646154-19.692308 129.969231-27.569231 74.830769-86.646154 133.907692-157.538461 169.353846-59.076923 35.446154-129.969231 47.261538-192.984616 31.507693-31.507692-3.938462-59.076923-15.753846-82.707692-31.507693l-3.938461-3.938461c0-3.938462 3.938462-7.876923 7.876923-7.876923 19.692308 0 39.384615-3.938462 59.076923-11.815385 19.692308-7.876923 39.384615-19.692308 55.138461-31.507692l3.938462-3.938462c0-3.938462 0-7.876923-3.938462-7.876923-15.753846-3.938462-27.569231-11.815385-39.384615-19.692308-15.753846-7.876923-27.569231-23.630769-35.446154-39.384615v-3.938461c0-3.938462 3.938462-7.876923 7.876923-7.876924h11.815385c3.938462 0 3.938462 0 3.938461-3.938461 3.938462-3.938462 0-7.876923-3.938461-11.815385-15.753846-7.876923-27.569231-19.692308-39.384616-31.507692-15.753846-15.753846-23.630769-35.446154-23.630769-55.138462v-3.938461c0-3.938462 7.876923-3.938462 7.876923-3.938462 3.938462 0 7.876923 3.938462 11.815385 3.938462h7.876923c3.938462 0 3.938462 0 7.876923-3.938462s3.938462-7.876923 0-11.815384c-15.753846-15.753846-27.569231-35.446154-31.507692-59.076923-3.938462-19.692308 0-43.323077 7.876923-63.015385v-3.938461c-7.876923 3.938462-3.938462 3.938462 0 7.876923 27.569231 27.569231 55.138462 51.2 90.584615 70.892307 39.384615 19.692308 82.707692 31.507692 126.030769 31.507693 3.938462 0 7.876923-3.938462 7.876923-7.876923 0-23.630769 7.876923-102.4 78.769231-122.092308 35.446154-11.815385 78.769231-3.938462 106.338462 27.569231 0 0 3.938462 3.938462 7.876923 3.938461 7.876923 0 15.753846-3.938462 27.569231-3.938461 7.876923-3.938462 15.753846-3.938462 23.630769-7.876923h7.876923c3.938462 0 3.938462 7.876923 3.938461 11.815384-3.938462 7.876923-11.815385 15.753846-19.692307 23.630769l-3.938462 3.938462c-3.938462 0-3.938462 3.938462-3.938461 7.876923s3.938462 7.876923 7.876923 7.876923 7.876923 0 15.753846-3.938461h7.876923c-3.938462-3.938462-3.938462 3.938462-7.876923 3.938461z" fill="#1296db"></path></svg>
        </g>`,
        telegram:  `<g transform="translate({x}, 680)" opacity="0.8" >
            <svg width="45" height="45" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                <path d="M679.424 746.861714l84.004571-395.995428c7.424-34.852571-12.580571-48.566857-35.437714-40.009143l-493.714286 190.281143c-33.718857 13.129143-33.133714 32-5.705142 40.557714l126.281142 39.424 293.156572-184.576c13.714286-9.142857 26.294857-3.986286 16.018286 5.156571l-237.129143 214.272-9.142857 130.304c13.129143 0 18.870857-5.705143 25.709714-12.580571l61.696-59.428571 128 94.281142c23.442286 13.129143 40.009143 6.290286 46.299428-21.723428zM1024 512c0 282.843429-229.156571 512-512 512S0 794.843429 0 512 229.156571 0 512 0s512 229.156571 512 512z" fill="#1296db"></path>
            </svg>
        </g>`
    };

    Object.keys(strArray).forEach((item, index) => {
        if(links[item]){
            let len = strArray[item];
            len = len.replace('{x}', 670 - str.length * 70);
            str.push(len);
        }
    })
    return str.join('');
}


async function shareImg(param, url) {
    return new Promise((resolve, reject) => {
        let localLang = {};
        if(lang[param.lang]){
            localLang = lang[param.lang];
        }else{
            localLang = lang.zh;
        }
        let replaceParam = {...param};

        replaceParam.create_time = new Date(param.create_time).toLocaleString();
        replaceParam.downTime = downStr(param.create_time, param);
        replaceParam.liquidity = ((replaceParam.liquidity || 0) * 1).toFixed(8);
        replaceParam.links = fromLinks(param.links);

        let svgStringLocal = replaceString(localLang, replaceParam);
        try {
            const resvg = new Resvg(svgStringLocal, {
                font: {
                    fontFiles: ['./lib/core/shareImg/msyh.ttc'], // Load custom fonts.
                    defaultFontFamily: '微软雅黑',
                    loadSystemFonts: false,
                },
            });
            const pngData = resvg.render();
            const pngBuffer = pngData.asPng();
            resolve(pngBuffer);
        }catch (e) {
            reject(e);
        }
        // let imgUrl = url ? url : __dirname + '/' + param.symbol + param.token_contract +'.png';
        // fs.writeFileSync(imgUrl, pngBuffer);
    })

}

exports.shareImg = shareImg;



