const accountModel = require('../models/AccountModel');
const depositModel = require('../models/DepositModel');
const withdrawModel = require('../models/WithdrawModel');
const findAccountModel = require('../models/FindAccountModel');
const analysisDailyModel = require('../models/AnalyzeDailyModel');
const analysisMonthlyModel = require('../models/AnalyzeMonthlyModel');
const regulationModel = require('../models/RegulationModel');

class API_Controller {
    async getInterestRateAPI(req, res) {
        const typeOfSaving = req.query.type;
        try {
            const result = await regulationModel.getCurrentTypeOfSaving();
            // find interest rate of type of saving
            const interestRate = result.find(
                (element) => element.type === typeOfSaving,
            );

            if (interestRate) {
                res.json(interestRate);
            }
        } catch (error) {
            return res.json({ message: 'fail' });
            res.status(500).json({ error: error.message });
        }
    }

    async getNewestIDAccountAPI(req, res) {
        try {
            const result = await accountModel.getNewestIDAccount();
            res.json(result);
        } catch (error) {
            return res.json({ message: 'fail' });
            res.status(500).json({ error: error.message });
        }
    }

    async getInformationAPI(req, res) {
        const id_account = req.query.id_account;
        console.log('id: ' + id_account);
        if (!id_account) {
            return;
        }

        try {
            const result =
                await accountModel.getInformationByIDAccount(id_account);
            res.json(result);
            return;
        } catch (error) {
            return res.json({ message: 'fail' });
        }
    }

    async getCurrentPrincipalAPI(req, res) {
        const { id_account } = req.query;

        if (!id_account) {
            res.status(400).json({ error: 'Missing id_account parameter' });
            return;
        }

        try {
            const result = await accountModel.getCurrentPrincipal(id_account);
            res.json(result);
        } catch (error) {
            return res.json({ message: 'fail' });
        }
    }

    async getCurrentBalanceAPI(req, res) {
        const id_account = req.query.id_account;
        const withdraw_date = req.query.withdraw_date;
        if (!id_account) {
            res.status(400).json({ error: 'Missing id_account parameter' });
            return;
        }
        try {
            const result = await accountModel.getCurrentBalance(
                id_account,
                withdraw_date,
            );
            res.json(result);
        } catch (error) {
            return res.json({ message: 'fail' });
        }
    }

    async createReportDailyAPI(req, res) {
        const date = req.query.date;
        if (!date) {
            res.status(400).json({ error: 'Missing date parameter' });
            return;
        }
        try {
            const result = await analysisDailyModel.getAnalyzeDaily({ date });
            res.json(result);
        } catch (error) {
            return res.json({ message: 'fail' });
        }
    }

    async createReportMonthlyAPI(req, res) {
        const month = req.query.month;
        const year = req.query.year;
        const type_of_saving = req.query.type_of_saving;

        if (!month || !year || !type_of_saving) {
            res.status(400).json({ error: 'Missing parameter' });
            return;
        }
        try {
            const result = await analysisMonthlyModel.getAnalyzeMonthly({
                month,
                year,
                type_of_saving,
            });
            res.json(result);
        } catch (error) {
            return res.json({ message: 'fail' });
        }
    }

    async findAccountAPI(req, res) {
        const id_account = req.query.id_account;
        const id_card = req.query.id_card;
        const date_created_account = req.query.date_created_account;
        const type_of_saving = req.query.type_of_saving;
        console.log(req.query);

        if (
            !id_account &&
            !id_card &&
            !date_created_account &&
            !type_of_saving
        ) {
            res.status(400).json({ error: 'Missing parameter' });
            return;
        }

        try {
            const result = await findAccountModel.findAccount({
                id_card,
                id_account,
                date_created_account,
                type_of_saving,
            });
            res.json(result);
        } catch (error) {
            return res.json({ message: 'fail' });
        }
    }

    async getMinDepMoneyAndMinWithDaysAPI(req, res) {
        const type = req.query.type;
        const apply_date = req.query.apply_date;

        if (!type || !apply_date) {
            res.status(400).json({ error: 'Missing parameter' });
            return;
        }

        try {
            const result = await regulationModel.getMinDepMoneyAndMinWitDays({
                type,
                apply_date,
            });
            res.json(result);
        } catch (error) {
            return res.json({ message: 'fail' });
        }
    }
    async getAllDepositAndWithdrawTransactionAPI(req, res) {
        try {
            const deposit = await depositModel.getAllDepositTransaction();
            const withdraw = await withdrawModel.getAllWithdrawTransaction();
            res.json( {deposited: deposit, withdrawn: withdraw} );
        } catch (error) {
            return res.json({ message: 'fail' });
        }
    }

    async getCurrentTypeOfSavingAPI(req, res) {
        try {
            const result = await regulationModel.getCurrentTypeOfSaving();
            res.json(result);
        } catch {
            return res.json({ message: 'fail' });
        }
    }

    async getAllTypeOfSavingAPI(req, res) {
        try {
            const result = await regulationModel.getAllTypeOfSaving();
            res.json(result);
        } catch {
            return res.json({ message: 'fail' });
        }
    }

    async getLatestAccountsAPI(req, res) {
        try {
            const result = await accountModel.getLatestAccounts(10);
            res.json(result);
        } catch {
            return res.json({ message: 'fail' });
        }
    }

    async getTotalOpenedAccountsAPI(req, res) {
        try {
            const result = await accountModel.getTotalOpenedAccount();
            res.json(result);
        } catch {
            return res.json({ message: 'fail' });
        }
    }

    async getTotalClosedAccountsAPI(req, res) {
        try {
            const result = await accountModel.getTotalClosedAccount();
            res.json(result);
        } catch {
            return res.json({ message: 'fail' });
        }
    }
}

module.exports = new API_Controller();
