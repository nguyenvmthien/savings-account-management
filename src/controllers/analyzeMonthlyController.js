const analyzeMonthlyModel = require('../models/analyzeMonthlyModel');
class Analyze_Monthly_Controller {
    renderSaAnalyzeMonthly(req, res) {
        res.render('analyze_monthly', { analyzeMonthly });
    }
}

module.exports = new Analyze_Monthly_Controller();
