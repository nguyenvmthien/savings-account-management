class editController {
    renderEdit(req, res) {
        res.render('sa-edit');
    }

    renderEditAccount(req, res) {
        res.render('sa-edit-account');
    }

    getInformation(req, res) {
        var id_account = req.body.id_account;
        // Get in4
        res.redirect("/sa/edit/account");
        return;
    }
}

module.exports = new editController();
