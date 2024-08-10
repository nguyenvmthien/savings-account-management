class Withdraw_Controller {
    renderSaWithraw(req, res) {
        res.render('sa_withdraw');
    }

    renderSaWithDrawAccount(req, res) {
        res.render('sa_withdraw_account');
    }

    withdraw(req, res) {
        return;
    }

    getInformationAPI(req, res) {
        var id_account = req.body.id_account;
        // Get in4
        res.redirect('/sa/withdraw/account');
        return;
    }

    getCurrentBalanceAPI(req, res) {
        return;
    }
}

module.exports = new Withdraw_Controller();
