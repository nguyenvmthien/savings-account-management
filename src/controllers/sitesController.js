class sitesController {
    renderSa(req, res) {
        res.render('sa');
    }

    renderContact(req, res) {
        res.render('contact');
    }

    renderStarting(req, res) {
        res.render("starting");
    }

    renderHome(req, res) {
    res.render("home");
    }
}

module.exports = new sitesController();
