class Analyze_Daily_Controller {
    renderSaAnalyzeDaily(req, res) {
        res.render('analysis_daily_report');
    }

    createReportAPI(req, res) {
        return;
    }
}

module.exports =  new Analyze_Daily_Controller();