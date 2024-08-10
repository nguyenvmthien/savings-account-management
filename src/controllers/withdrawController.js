class Withdraw_Controller {
    renderSaWithdraw(req, res) {
        res.render('sa_withdraw');
    }

    renderSaWithdrawAccount(req, res) {
        res.render('sa_withdraw_account');
    }

    withdraw(req, res) {
        return;
    }
}

module.exports = new Withdraw_Controller();
