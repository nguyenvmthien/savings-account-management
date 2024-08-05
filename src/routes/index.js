const CreateHomeRouter = require("./home");
const CreateStartingRouter = require ("./starting");
const createRouter = require("./create")
function route(app) {
    app.use("/starting/home", CreateHomeRouter);
    app.use("/starting", CreateStartingRouter);
    app.use("/sa-create", createRouter);
}

module.exports = route;

