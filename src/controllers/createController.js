const accountModel = require('../models/AccountModel');
class Create_Account_Controller {
    renderSaCreate(req, res) {
        res.render('sa_create');
    }

    async create(req, res) {
        if (Object.keys(req.body).length === 0) {
            //console.log('No data');
            return;
        }

        const id_account = 'MS' + Math.floor(Math.random() * 1000000);
        const {
            id_card,
            customer_name,
            customer_address,
            money,
            type_of_saving,
            date_created,
        } = req.body;

        console.log(
            id_card,
            customer_name,
            customer_address,
            id_account,
            money,
            type_of_saving,
            date_created,
        );

        try {
            const result = await accountModel.create({
                id_card,
                customer_name,
                customer_address,
                id_account,
                money,
                type_of_saving,
                date_created,
            });
            if (result.message === 'success')
                res.render('sa_create', { message: 'success' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    getInterestRateAPI(req, res) {
        console.log(req.query.type);

        if (Object.keys(req.query).length === 0) {
            console.log('No data');
            return;
        }

        const typeOfSaving = req.query.type;
        console.log(typeOfSaving);
    }

    getBiggestIDAccountAPI(req, res) {
        return;
    }
}

module.exports = new Create_Account_Controller();
