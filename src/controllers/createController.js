class CreateController {
    index(req, res) {
        res.render('create');
    }
}

module.exports = new CreateController();
