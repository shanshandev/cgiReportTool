import { getUrlInfo, getPlatformInfo} from './util'
const ERROR_TYPE_VALUE = -2;
const ABORT_CODE = -1111;
const RESPONCE_ERROR_CODE = -2222;
export default class CustomXhr {
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
            this.urlObj = getUrlInfo(url);
            if (context.exclude.indexOf(url) == -1) {
                that._onreadystatechange = that.onreadystatechange || function() {};
                that.onreadystatechange = function () {
                    context.listenStateChange(that);
                    that._onreadystatechange();

                }
            }
            this._open(type, url, async, user, password);
        }
    }
    send() {
        const _xhr = this._xhr;
        _xhr.prototype._send = _xhr.prototype.send;
        _xhr.prototype.send = function (data) {
            this._send(data);
        }
    }
    abort() {
        const _xhr = this._xhr;
        const context = this;
        _xhr.prototype_abort = _xhr.prototype.abort;
        _xhr.prototype.abort = function () {
            let now = +new Date;
            let time = now - this._startTime;

            context.cgiReport.reportCgiInfo({
                hostname: this.urlObj.hostname,
                cgi: this.urlObj.path,
                type: RESPONCE_ERROR_CODE,
                resultCode: ABORT_CODE,
                time: time,
                status: this.status,
            })
            this._abort();
        }
    }
    listenStateChange(that) {
        const xhr = that
        if (xhr.readyState == 4) {
            let now = +new Date;
            let time = now - xhr._startTime;
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                let result = this.getResult(that);
                this.cgiReport.reportCgiInfo({
                    hostname: xhr.urlObj.hostname,
                    cgi: xhr.urlObj.path,
                    time: time,
                    platform: getPlatformInfo(window.navigator),
                    status: xhr.status,
                    resultCode: result.code,
                    type: result.type,
                    contentType: result.contentType,
                    responseData: result.responseData
                })
            } else {
                this.cgiReport.reportCgiInfo({
                    hostname: xhr.urlObj.hostname,
                    cgi: xhr.urlObj.path,
                    time: time,
                    status: xhr.status,
                    type: RESPONCE_ERROR_CODE,
                    resultCode: RESPONCE_ERROR_CODE
                })
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
            return mime && (mime == 'text/html' ? 'html' :
                mime = jsonType ? 'json' :
                    scriptRE.test(mime) ? 'script' :
                        xmlRE.test(mime) ? 'xml' : 'text')
        }
        let dataType = mimeToDataType(xhr.getResponseHeader('Content-type'));
        if (xhr.responseType == 'blob' || xhr.responseType == 'arraybuffer') {
            result = xhr.response;
        } else {
            result = xhr.responseText;
            if (dataType == 'script') (1, eval)(result);
            else if (dataType == 'xml') result = xhr.responseXML;
            else if (dataType == 'json') /^\s*$/.test(result) ? null : JSON.parse(result);
            else if (dataType == 'text') /^\s*$/.test(result) ? null : JSON.parse(result);
        }
        let codeResult = this.reportCode(result);
        if (!codeResult) {
            console.error('reportCode function must return an object,e.g {type: "", code: ""}');
        }
        codeResult['contentType'] = dataType;
        return codeResult;

    }
}