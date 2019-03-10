export default class CgiReport{
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

        this.doReportRquest(this.url , reportParam);
    }
    doReportRquest(url, data = {}) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            //do nothing
        }
        let forms = [];
        for (let key in data) {
            forms.push(`${key}=${data[key]}`);
        }
        xhr.send(forms.join('&'));

    }
  
}
