class Regulation_Controller {
    renderChangeTypeCreate(req, res) {
        res.render('change_type_create');
    }

    renderChangeTypeEdit(req, res) {
        res.render('change_type_edit');
    }

    renderChangeTypeDelete(req, res) {
        res.render('change_type_delete');
    }

    renderChangeType(req, res) {
        res.render('change_type');
    }

    create(req, res) {
        const {type, interest_rate, min_dep_money, min_days_withdraw, applied_time, applied_date}  = req.body;

        console.log(
            type,
            interest_rate,
            min_dep_money,
            min_days_withdraw,
            applied_time,
            applied_date
        );
    }

    edit(req, res) {
        const {type, interest_rate, min_dep_money, min_days_withdraw, applied_time, applied_date}  = req.body;
        console.log(
        type,
        interest_rate,
        min_dep_money,
        min_days_withdraw,
        applied_time,
        applied_date
        );
    }

    delete(req, res) {
        const {type} = req.body;
        console.log (
            type
        )
    }
}

module.exports = new Regulation_Controller();
