const createRouter = require('./create');

function route(app) {
    app.use('/', createRouter);
}

module.exports = route;