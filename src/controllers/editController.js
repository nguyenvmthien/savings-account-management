class Edit_Account_Controller {
    renderSaEdit(req, res) {
        res.render('sa_edit');
    }

    renderSaEditAccount(req, res) {
        res.render('sa_edit_account');
    }

    edit(req, res) {
        return;
    }
}

module.exports = new Edit_Account_Controller();
