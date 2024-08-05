class editController {
    renderEdit(req, res) {
        res.render('sa-edit');
    }

    renderEditAccount(req, res) {
        res.render('sa-edit-account');
    }
}

module.exports = new editController();
