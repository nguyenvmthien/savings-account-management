const createHomeRouter = require("./home");
const createStartingRouter = require ("./starting");
const createRouter = require("./create");
const createadjustedRouter = require("./changetype");
const sitesRouter = require("./sites")
const editRouter = require("./edit")
const savingAccountRouter = require("./sa")

function route(app) {
    app.use("/change-type-create", createadjustedRouter);
    app.use("/home", createHomeRouter);
    app.use("/starting", createStartingRouter);
    app.use("/sa-create", createRouter);
    app.use("/sa", savingAccountRouter);
    app.use("/", sitesRouter)
}
module.exports = route;

