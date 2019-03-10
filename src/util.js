
/**
 *  you can customize the function and return to data you need
 */
export function getPlatformInfo(navigator) {
    let os, browser;
    let ua = navigator.userAgent;
    let wechat = ua.match(/MicroMessage\/([\d.]+)/);
    let mqq = ua.match(/(?: V1_AND_SQ_|QQ)([\d.]+)/);
    if (/android/i.test(ua) || (/UCBrower/i.test(ua) && (/Adr[\s\/]*[\d.]+/).test(ua))) {
        os = 'android';
    }
    if (!os && /(iPhone|iPad|iPod|iOS)/.test(ua)) {
        os = 'ios'
    }
    if (wechat) {
        browser = 'wechat';
    }
    if (mqq) {
        browser = 'mqq';
    }
    return {
        os: os || 'unknown',
        browser: browser || 'unknown'
    }
}

export function getUrlInfo(url) {
    let match = url.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/) || [];
    return {
        hostname: match[3],
        path: match[5]
    }
}