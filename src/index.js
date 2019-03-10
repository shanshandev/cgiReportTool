import CgiReport from './cgiReport'
import CustomXhr from './customXhr'
export default class CgiAnalysisTool {
    /**
     * @param {obj} opt 
     * @param {string} opt.reportUrl
     * @param {array} opt.exclude
     * @param {funciton} opt.reportCode
     */
    constructor(opt) {
        this.cgiReport = new CgiReport(opt.reportUrl);
        this.exclude = opt.exclude || [];
        this.exclude.push(opt.reportUrl)
        this.customXhr = new CustomXhr({
            cgiReport: this.cgiReport,
            exclude: this.exclude,
            reportCode: opt.reportCode
        })
    }
}
window.CgiAnalysisTool = CgiAnalysisTool;