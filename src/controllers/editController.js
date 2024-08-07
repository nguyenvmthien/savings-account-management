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

    getInformationAPI(req, res) {
        var id_account = req.body.id_account;
        // Get in4
        res.redirect('/sa/edit/account');
        return;
    }
}

module.exports = new Edit_Account_Controller();
