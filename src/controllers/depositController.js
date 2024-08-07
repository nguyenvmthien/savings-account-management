class Deposit_Controller {
    renderSaDeposit(req, res) {
        res.render('sa_deposit');
    }

    renderSaDepositAccount(req, res) {
        res.render('sa_deposit_account');
    }

    deposit(req, res) {
        return;
    }

    getInformationAPI(req, res) {
        var id_account = req.body.id_account;
        // Get in4
        res.redirect("/sa/deposit/account");
        return;
    }

    getCurrentPrincipalAPI(req, res) {
        return;
    }
}

module.exports = new Deposit_Controller();
