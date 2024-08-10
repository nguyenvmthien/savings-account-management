class Sites_Controller {
    renderSa(req, res) {
        res.render('sa');
    }

    renderContact(req, res) {
        res.render('contact');
    }

    renderStarting(req, res) {
        res.render('starting');
    }

    renderHome(req, res) {
        res.render('home');
    }

    renderAnalysis(req, res) {
        res.render('analysis');
    }

    renderDefault(req, res) {
        res.redirect('/starting');
    }
}

module.exports = new Sites_Controller();
