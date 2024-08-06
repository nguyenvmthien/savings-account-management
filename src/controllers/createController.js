class Create_Account_Controller {
    renderSaCreate(req, res) {
        res.render('sa_create');
    }

    create(req, res) {
        if (Object.keys(req.body).length === 0) {

            //console.log('No data');
            return;
        }

        const { id_card, customer_name, customer_address, money, type_of_saving, date_created } = req.body;
        //console.log(id_card, customer_name, customer_address, money, type_of_saving, date_created);
        //accountModel.createNewAccount({ id_card, customer_name, customer_address, date_created, type_of_saving, money });
    }

    async getInterestRateAPI(req, res) {
        console.log(req.query.type);

        if (Object.keys(req.query).length === 0) {
            console.log('No data');
            return;
        }

        const typeOfSaving = req.query.type;
        console.log(typeOfSaving);
        // try {
        //     const result = await accountModel.getInterestRate(typeOfSaving);
        //     console.log(result);
        //     res.json(result);
        // } catch (error) {
        //     res.status(500).json({ error: error.message });
        // }
    }

    getBiggestIDAccountAPI(req, res) {
        return;
    }
}

module.exports = new Create_Account_Controller();
