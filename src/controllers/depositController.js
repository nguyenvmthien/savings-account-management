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
}

module.exports = new Deposit_Controller();
