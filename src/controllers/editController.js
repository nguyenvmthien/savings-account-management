const accountModel = require('../models/AccountModel');
class Edit_Account_Controller {
    renderSaEdit(req, res) {
        res.render('sa_edit');
    }

    renderSaEditAccount(req, res) {
        res.render('sa_edit_account');
    }

    async edit(req, res) {
        const { id_card, id_account, customer_name, customer_address } =
            req.body;

        if (!id_card || !id_account || !customer_name || !customer_address) {
            res.status(400).json({ error: 'Missing parameter' });
            return;
        }

        try {
            const result = await accountModel.edit({
                id_card,
                customer_name,
                customer_address,
            });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'fail' });
        }
    }
}

module.exports = new Edit_Account_Controller();
