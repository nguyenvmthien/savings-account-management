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
}

module.exports = new Withdraw_Controller();
