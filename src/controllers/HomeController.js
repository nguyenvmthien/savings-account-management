class HomeController {
  createHome(req, res) {
    res.render("home");
  }
}

module.exports = new HomeController();
