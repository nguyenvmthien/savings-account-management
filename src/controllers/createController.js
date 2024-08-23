const accountModel = require('../models/AccountModel');
class Create_Account_Controller {
    renderSaCreate(req, res) {
        res.render('sa_create');
    }

    async create(req, res) {
        if (Object.keys(req.body).length === 0) {
            res.json('Missing Parameter');
            return;
        }

        const {
            id_card,
            customer_name,
            customer_address,
            id_account,
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

        // create account
        const result = await accountModel.create({
            id_card,
            customer_name,
            customer_address,
            id_account,
            money,
            type_of_saving,
            date_created,
        });
        res.json(result);
    }
}

module.exports = new Create_Account_Controller();
