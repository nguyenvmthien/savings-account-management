const CreateHomeRouter = require("./home");
const CreateStartingRouter = require ("./starting");
function route(app) {
    app.use ("/starting/home", CreateHomeRouter);
    app.use("/starting", CreateStartingRouter);
    app.use('/sa-create', createRouter);
}

module.exports = route;

