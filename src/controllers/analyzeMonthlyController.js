const analyzeMonthlyModel = require('../models/AnalyzeMonthlyModel');
class Analyze_Monthly_Controller {
    renderSaAnalyzeMonthly(req, res) {
        res.render('analyze_monthly_report');
    }
}

module.exports = new Analyze_Monthly_Controller();
