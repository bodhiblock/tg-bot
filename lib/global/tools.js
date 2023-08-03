const util = require('util'), path = require('path'), fs = require('fs');
const crypto = require('crypto');
const BigNumber = require('bignumber.js');


module.exports.formatPrice = function (price) {
    let pbn = new BigNumber(price);
    if (price > 1) {
        return parseFloat(pbn.toFixed(4));
    }

    let pp = pbn.toFixed();
    let p = pp.substr(2);
    let zcount = 0;
    for (let i in pp) {
        if (p[i] == 0) {
            zcount++;
        } else {
            break;
        }
    }
    if (zcount < 4) {
        return parseFloat(pbn.toFixed(8));
    } else {
        return `0.(${zcount})${p.substr(zcount, 4)}`;
    }
}

module.exports.formatNumber = function (n) {
    if (!n) {
        return 0;
    }

    if (n > 1000000) {
        return (parseInt((n / 1000000) * 100) / 100) + 'M'
    } else if (n > 1000) {
        return (parseInt((n / 1000) * 100) / 100) + 'K'
    } else if (n > 1) {
        return (parseInt(n * 100) / 100)
    } else if (n == 0) {
        return 0;
    } else {
        return this.formatPrice(n)
    }
}

module.exports.calcDateDiff = function (dtFrom) {
    let totalMin = parseInt((new Date() - dtFrom) / 60 / 1000);
    let totalHour = parseInt(totalMin / 60);
    let totalDay = parseInt(totalHour / 24);
    let totalMonth = parseInt(totalDay / 30);
    let totalYear = parseInt(totalDay / 365);

    if (totalMonth >= 1) {
        return this.dateFormat('yyyy-MM-dd', dtFrom);
    } else if (totalDay >= 1) {
        return `~ ${totalDay}day ago`;
    } else if (totalHour >= 1) {
        return `~ ${totalHour % 24}hour ago`;
    } else {
        return `~ ${totalMin % 60}min ago`;
    }
}

module.exports.mkdir = function (dir) {
    let p = path.dirname(path.normalize(dir));
    let isAbs = path.isAbsolute(p);
    let current_path = '';
    p = p.split(path.sep);
    if (isAbs) {
        current_path = p[0];
        if ((current_path.length <= 0) && (path.sep == '/')) {
            current_path = "/";
        }
        p.shift();
    }

    for (let i = 0; i < p.length; ++i) {
        current_path = path.join(current_path, p[i]);
        if (!fs.existsSync(current_path)) {
            fs.mkdirSync(current_path);
        }
    }
};

// [min, max]
module.exports.random = function (min, max) {
    var range = max - min;
    var rand = Math.random();
    return (min + Math.round(rand * range));
}

module.exports.intersect = function (a, b) {
    if (a.length == 0 || b.length == 0)
        return true;

    for (let i = 0; i < a.length; i++) {
        if (b.indexOf(a[i]) >= 0)
            return true;
    }

    return false;
}

module.exports.md5 = function (s) {
    let p = crypto.createHash('md5');
    p.update(s);
    return p.digest('hex');
};

module.exports.sha1 = function (s) {
    let p = crypto.createHash('sha1');
    p.update(s);
    return p.digest('hex');
};

module.exports.publicEncrypt = function (s, publicKey) {
    let buffer = Buffer.from(s);
    let encrypt = crypto.publicEncrypt(publicKey, buffer)
    return encrypt.toString("base64");
}

module.exports.privateDecrypt = function (s, privateKey) {
    let buffer = Buffer.from(s, "base64");
    let decrypt = crypto.privateDecrypt(privateKey, buffer);
    return decrypt.toString();
}

module.exports.privateEncrypt = function (s, privateKey) {
    let buffer = Buffer.from(s);
    let encrypt = crypto.privateEncrypt(privateKey, buffer)
    return encrypt.toString("base64");
}

module.exports.publicDecrypt = function (s, publicKey) {
    let buffer = Buffer.from(s, "base64");
    let decrypt = crypto.publicDecrypt(publicKey, buffer);
    return decrypt.toString();
}

module.exports.getDayDiff = function (tt1, tt2) {
    let t1 = new Date(tt1).addHours(8);
    let t2 = new Date(tt2).addHours(8);
    t1.setHours(0);
    t1.setMinutes(0);
    t1.setSeconds(0);
    t1.setMilliseconds(0);
    t2.setHours(0);
    t2.setMinutes(0);
    t2.setSeconds(0);
    t2.setMilliseconds(0);
    return (t1 - t2) / (24 * 60 * 60 * 1000);
};

module.exports.arrayFind = function (arr, key, value) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] == value)
            return i;
    }

    return -1;
};

module.exports.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports.getTimestamp = function () {
    return parseInt(new Date().getTime() / 1000)
}

module.exports.aesEncrypt = function (str, secret) {
    var cipher = crypto.createCipheriv('aes-128-cbc', secret, settings.cipher_iv);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}

module.exports.aesDecrypt = function (str, secret) {
    var decipher = crypto.createDecipheriv('aes-128-cbc', secret, settings.cipher_iv);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

module.exports.divDecimals = function (amount, decimals) {
    let amountBN = new BigNumber(amount);
    let factor = new BigNumber(10).pow(parseInt(decimals));
    return amountBN.div(factor).toString();
}

module.exports.mulDecimals = function (amount, decimals, base) {
    let amountBN = new BigNumber(amount);
    let factor = new BigNumber(10).pow(parseInt(decimals));
    let result = amountBN.times(factor).toFixed(0);
    if (base) {
        return new BigNumber(result).toString(base);
    } else {
        return result;
    }
}

module.exports.gtDecimals = function (n, gt) {
    let dn = new BigNumber(n);
    let dgt = new BigNumber(gt);
    return dn.gt(dgt);
}

module.exports.createHmacSHA1 = function (s, hmacKey) {
    return crypto.createHmac('sha1', hmacKey).update(s, 'utf8').digest('hex').toUpperCase();
}

module.exports.getPureURL = function (url) {
    if (url.startsWith("https://")) {
        url = url.substr(url.indexOf('/', 8));
    } else if (url.startsWith("http://")) {
        url = url.substr(url.indexOf('/', 7));
    }

    let pos = url.indexOf('?');
    if (pos != -1) {
        url = url.substr(0, pos);
    }

    return url;
}

module.exports.calcSign = function (url, data) {
    var newkey = Object.keys(data).sort();
    var source = url;
    if (newkey.length > 0) {
        source += '?';
    }

    for (let i in newkey) {
        source += newkey[i] + '=' + data[newkey[i]] + '&';
    }
    source = source.substr(0, source.length - 1);
    var sign = tools.createHmacSHA1(source, settings.hmacKey);
    return sign;
}

module.exports.signData = function (url, data) {
    if (!data.ts) {
        data.ts = parseInt(Date.now() / 1000);
    }

    data.sign = this.calcSign(url, data);
}

module.exports.checkSign = function (url, data) {
    if (!data.sign || !data.ts) {
        return { result: false };
    }

    if (Math.abs(data.ts - Date.now() / 1000) > 5) {
        return { result: false };
    }

    let sign = data.sign;
    delete data.sign;
    let sign1 = this.calcSign(url, data);
    delete data.ts;
    return {
        result: sign.toUpperCase() == sign1.toUpperCase(),
        sign: sign1
    };
}

module.exports.kv2regex = function (data, keys) {
    for (let k in keys) {
        if (data[k]) {
            data[k] = { "$regex": "^" + data[k] + "$", $options: "i" }
        }
    }
}

module.exports.str_replace = function (str, rep, val) {
    let ret = str;
    for (k in rep) {
        ret = ret.replace(rep[k], val[k]);
    }
    return ret;
}

module.exports.dateFormat = function (format, date) {
    if (!format) return '';
    date = date || new Date();
    let dateMap = {
        y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
        S: date.getMilliseconds()
    };
    return format.replace(/(y+)|(M+)|(d+)|(h+)|(m+)|(s+)|(S+)/g, (a) => _add0(dateMap[a[0]], a.length))
}


function _add0(time, len) {
    time = time.toString();
    let l = time.length;
    return l < len ? '0'.repeat(len - l) + time : time;
}

