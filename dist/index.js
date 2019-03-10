/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class CgiReport {
    constructor(url) {
        this.url = url;
    }
    reportCgiInfo(opt = {}) {
        if (!opt.hostname || !opt.cgi) {
            console.error('hostname and cgi are required');
            return;
        }
        let reportParam = {
            cgi: encodeURIComponent(opt.cgi || ''),
            hostname: opt.hostname,
            type: opt.type,
            resultCode: opt.resultCode,
            time: opt.time,
            platform: opt.platform,
            contentType: opt.contentType || '',
            responseData: opt.responseData || ''
        };

        this.doReportRquest(this.url, reportParam);
    }
    doReportRquest(url, data = {}) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            //do nothing
        };
        let forms = [];
        for (let key in data) {
            forms.push(`${key}=${data[key]}`);
        }
        xhr.send(forms.join('&'));
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = CgiReport;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(2);

const ERROR_TYPE_VALUE = -2;
const ABORT_CODE = -1111;
const RESPONCE_ERROR_CODE = -2222;
class CustomXhr {
    constructor(opt) {
        this.cgiReport = opt.cgiReport;
        this.reportCode = opt.reportCode;
        this._xhr = XMLHttpRequest;
        this.exclude = opt.exclude;
        this.open();
        this.send();
        this.abort();
    }
    open() {
        const _xhr = this._xhr;
        const context = this;
        _xhr.prototype._open = _xhr.prototype.open;
        _xhr.prototype._startTime = 0;
        _xhr.prototype.open = function (type, url, async, user, password) {
            this._startTime = +new Date();
            let that = this;
            this.urlObj = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* getUrlInfo */])(url);
            if (context.exclude.indexOf(url) == -1) {
                that._onreadystatechange = that.onreadystatechange || function () {};
                that.onreadystatechange = function () {
                    context.listenStateChange(that);
                    that._onreadystatechange();
                };
            }
            this._open(type, url, async, user, password);
        };
    }
    send() {
        const _xhr = this._xhr;
        _xhr.prototype._send = _xhr.prototype.send;
        _xhr.prototype.send = function (data) {
            this._send(data);
        };
    }
    abort() {
        const _xhr = this._xhr;
        const context = this;
        _xhr.prototype_abort = _xhr.prototype.abort;
        _xhr.prototype.abort = function () {
            let now = +new Date();
            let time = now - this._startTime;

            context.cgiReport.reportCgiInfo({
                hostname: this.urlObj.hostname,
                cgi: this.urlObj.path,
                type: RESPONCE_ERROR_CODE,
                resultCode: ABORT_CODE,
                time: time,
                status: this.status
            });
            this._abort();
        };
    }
    listenStateChange(that) {
        const xhr = that;
        if (xhr.readyState == 4) {
            let now = +new Date();
            let time = now - xhr._startTime;
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                let result = this.getResult(that);
                this.cgiReport.reportCgiInfo({
                    hostname: xhr.urlObj.hostname,
                    cgi: xhr.urlObj.path,
                    time: time,
                    platform: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* getPlatformInfo */])(window.navigator),
                    status: xhr.status,
                    resultCode: result.code,
                    type: result.type,
                    contentType: result.contentType,
                    responseData: result.responseData
                });
            } else {
                this.cgiReport.reportCgiInfo({
                    hostname: xhr.urlObj.hostname,
                    cgi: xhr.urlObj.path,
                    time: time,
                    status: xhr.status,
                    type: RESPONCE_ERROR_CODE,
                    resultCode: RESPONCE_ERROR_CODE
                });
            }
        }
    }
    getResult(xhr) {
        let result;
        let mimeToDataType = function (mime) {
            let jsonType = 'appliaction/json';
            let scriptRE = /(?:text|application)\/javascript/i;
            let xmlRE = /(?: text|application)\/xml/i;
            if (mime) mime = mime.split(';')[0];
            return mime && (mime == 'text/html' ? 'html' : mime = jsonType ? 'json' : scriptRE.test(mime) ? 'script' : xmlRE.test(mime) ? 'xml' : 'text');
        };
        let dataType = mimeToDataType(xhr.getResponseHeader('Content-type'));
        if (xhr.responseType == 'blob' || xhr.responseType == 'arraybuffer') {
            result = xhr.response;
        } else {
            result = xhr.responseText;
            if (dataType == 'script') (1, eval)(result);else if (dataType == 'xml') result = xhr.responseXML;else if (dataType == 'json') /^\s*$/.test(result) ? null : JSON.parse(result);else if (dataType == 'text') /^\s*$/.test(result) ? null : JSON.parse(result);
        }
        let codeResult = this.reportCode(result);
        if (!codeResult) {
            console.error('reportCode function must return an object,e.g {type: "", code: ""}');
        }
        codeResult['contentType'] = dataType;
        return codeResult;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CustomXhr;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = getPlatformInfo;
/* harmony export (immutable) */ __webpack_exports__["a"] = getUrlInfo;

/**
 *  you can customize the function and return to data you need
 */
function getPlatformInfo(navigator) {
    let os, browser;
    let ua = navigator.userAgent;
    let wechat = ua.match(/MicroMessage\/([\d.]+)/);
    let mqq = ua.match(/(?: V1_AND_SQ_|QQ)([\d.]+)/);
    if (/android/i.test(ua) || /UCBrower/i.test(ua) && /Adr[\s\/]*[\d.]+/.test(ua)) {
        os = 'android';
    }
    if (!os && /(iPhone|iPad|iPod|iOS)/.test(ua)) {
        os = 'ios';
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
    };
}

function getUrlInfo(url) {
    let match = url.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/) || [];
    return {
        hostname: match[3],
        path: match[5]
    };
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cgiReport__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__customXhr__ = __webpack_require__(1);


class CgiAnalysisTool {
    /**
     * @param {obj} opt 
     * @param {string} opt.reportUrl
     * @param {array} opt.exclude
     * @param {funciton} opt.reportCode
     */
    constructor(opt) {
        this.cgiReport = new __WEBPACK_IMPORTED_MODULE_0__cgiReport__["a" /* default */](opt.reportUrl);
        this.exclude = opt.exclude || [];
        this.exclude.push(opt.reportUrl);
        this.customXhr = new __WEBPACK_IMPORTED_MODULE_1__customXhr__["a" /* default */]({
            cgiReport: this.cgiReport,
            exclude: this.exclude,
            reportCode: opt.reportCode
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["default"] = CgiAnalysisTool;

window.CgiAnalysisTool = CgiAnalysisTool;

/***/ })
/******/ ]);