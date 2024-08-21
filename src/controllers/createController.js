const accountModel = require('../models/AccountModel');
class Create_Account_Controller {
    renderSaCreate(req, res) {
        res.render('sa_create');
    }

    async create(req, res) {
        if (Object.keys(req.body).length === 0) {
            res.json("Missing Parameter");
            return;
        }

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
            money,
            type_of_saving,
            date_created,
        );
        // get next id_account, format id_account: MS + 10 digits
        const pre_id_account = await accountModel.getNewestIDAccount();
        console.log(pre_id_account);

        // Split id_account into prefix and number
        const prefix = 'MS';
        const number = pre_id_account.slice(prefix.length); // Slice after the prefix

        // Increase id_account
        const next_number = (parseInt(number, 10) + 1)
            .toString()
            .padStart(number.length, '0');
        const id_account = prefix + next_number;

        console.log(id_account);
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
