const accountModel = require('../models/AccountModel');
const depositModel = require('../models/DepositModel');
const withdrawModel = require('../models/WithdrawModel');
const findAccountModel = require('../models/FindAccountModel');
const analysisDailyModel = require('../models/AnalyzeDailyModel');
const analysisMonthlyModel = require('../models/AnalyzeMonthlyModel');
const regulationModel = require('../models/RegulationModel');

class API_Controller {
    async getInterestRateAPI(req, res) {
        console.log(req.query.type);

        if (Object.keys(req.query).length === 0) {
            console.log('No data');
            return;
        }

        const typeOfSaving = req.query.type;
        console.log(typeOfSaving);
        try {
            const result = await regulationModel.getCurrentTypeOfSaving();
            // find interest rate of type of saving
            const interestRate = result.find(
                (element) => element.type === typeOfSaving
            );

            if (interestRate) {
                res.json(interestRate);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getNewestIDAccountAPI(req, res) {
        try {
            const result = await accountModel.getNewestIDAccount();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getInformationAPI(req, res) {
        const id_account = req.query.id_account;
        if (!id_account) {
            res.json({ error: 'Missing id_account parameter' });
            return;
        }
        
        try {
            const result = await accountModel.getInformationByIDAccount(id_account);
            res.json(result);
        } catch (error) {
            res.redirect(req.originalUrl);
            res.json({ error: 'fail' });
            return;
        }

        if (req.originalUrl == '/sa/edit') res.redirect('/sa/edit/account');
        else if (req.originalUrl == '/sa/deposit')
            res.redirect('/sa/deposit/account');
        else if (req.originalUrl == '/sa/withdraw')
            res.redirect('/sa/withdraw/account');
        else console.log('Routing error');

        
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
            res.status(500).json({ error: error.message });
        }
    }


    async getCurrentBalanceAPI(req, res) {
        const id_account = req.query.id_account;
        if (!id_account) {
            res.status(400).json({ error: 'Missing id_account parameter' });
            return;
        }
        try {
            const result = await accountModel.getCurrentBalance(id_account);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
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
            res.status(500).json({ error: error.message });
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
            res.status(500).json({ error: error.message });
        }
    }

    async findAccountAPI(req, res) {
        const id_account = req.query.id_account;
        const id_card = req.query.id_card;
        const date_created_account = req.query.date_created_account;
        const type_of_saving = req.query.type_of_saving;

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
            res.status(500).json({ error: error.message });
        }
    }

    async getMinDepMoneyAndMinWithDaysAPI(req, res) {
        const type = req.query.type;
        const applied_date = req.query.applied_date;
        const applied_time = req.query.applied_time;

        if (!type || !applied_date || !applied_time) {
            res.status(400).json({ error: 'Missing parameter' });
            return;
        }

        try {
            const result = await regulationModel.getMinDepMoneyAndMinWitDays({
                type,
                applied_date,
                applied_time,
            });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }}

module.exports = new API_Controller();
