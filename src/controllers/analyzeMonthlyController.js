class Analyze_Monthly_Controller {
    renderSaAnalyzeMonthly(req, res) {
        res.render('analysis_monthly_report');
    }

    createReportAPI(req, res) {
        return;
    }
}

module.exports = new Analyze_Monthly_Controller();
