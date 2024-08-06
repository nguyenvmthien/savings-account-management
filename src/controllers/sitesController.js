class sitesController {
    renderSa(req, res) {
        res.render('sa');
    }
    renderContact(req, res) {
        res.render('contact');
    }
}

module.exports = new sitesController();
