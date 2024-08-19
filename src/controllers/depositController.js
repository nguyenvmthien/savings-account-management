const accountModel = require('../models/AccountModel');
class Deposit_Controller {
    renderSaDeposit(req, res) {
        res.render('sa_deposit');
    }

    async renderSaDepositAccount(req, res) {
        res.render('sa_deposit_account');
    }

    async deposit(req, res) {
        const { id_account, money_deposit, deposit_date } = req.body;

        if (!id_account || !money_deposit || !deposit_date) {
            res.status(400).json({ error: 'Missing parameter' });
            return;
        }
        try {
            const result = await depositModel.deposit({
                id_account,
                money_deposit,
                deposit_date,
            });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new Deposit_Controller();
