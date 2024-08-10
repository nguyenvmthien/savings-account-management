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
        return;
    }

    edit(req, res) {
        return;
    }

    delete(req, res) {
        return;
    }

    getMinDesMoneyAndMinWithDaysAPI(req, res) {
        return;
    }
}

module.exports = new Regulation_Controller();
