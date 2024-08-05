const createHomeRouter = require("./home");
const createStartingRouter = require ("./starting");
const createRouter = require("./create")
function route(app) {
    app.use("/home", createHomeRouter);
    app.use("/starting", createStartingRouter);
    app.use("/sa-create", createRouter);
}

module.exports = route;

