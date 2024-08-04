const createRouter = require('./create');

function route(app) {
    app.use('/sa-create', createRouter);
}

module.exports = route;
