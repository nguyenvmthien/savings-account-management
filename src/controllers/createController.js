class CreateController {
    render_sa_create(req, res) {
        res.render('sa-create');
    }

    create(req, res) {
        if (Object.keys(req.body).length === 0) {

            //console.log('No data');
            return;
        }

        const { c_id, name, address, money, tos, create_date } = req.body;
        console.log(c_id, name, address, money, tos, create_date);
        //accountModel.createNewAccount({ c_id, name, address, create_date, tos, money });
    }

    async get_interest_rate_API(req, res) {
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
}

module.exports = new CreateController();
