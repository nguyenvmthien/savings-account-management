const depositModel = require('../models/DepositModel');
class Deposit_Controller {
    renderSaDeposit(req, res) {
        res.render('sa_deposit');
    }

    async renderSaDepositAccount(req, res) {
        res.render('sa_deposit_account');
    }

    async deposit(req, res) {
        const { id_account, money_deposit, deposit_date } = req.body;
        console.log(req.body);
        if (!id_account || !money_deposit || !deposit_date) {
            res.status(400).json({ message: "fail" });
            return;
        }
        try {
            await depositModel.deposit({
                id_account,
                money_deposit,
                deposit_date,
            });
            res.json({message: "success" });
        } catch (error) {
            res.json({ message: "fail" });
        }
    }
}

module.exports = new Deposit_Controller();
