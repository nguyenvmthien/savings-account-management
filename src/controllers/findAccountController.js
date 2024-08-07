class Find_Account_Controller {
    renderSaFindAccount(req, res) {
        res.render('analysis_find_account');
    }

    createReportAPI(req, res) {
        return;
    }
}

module.exports =  new Find_Account_Controller();