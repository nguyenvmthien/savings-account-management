const createhomeRouter = require("./home");
const createstartingRouter = require ("./starting");
const createRouter = require("./create");
const createadjustedRouter = require("./changetype");
const sitesRouter = require("./sites")
const editRouter = require("./edit")

function route(app) {
    app.use("/change-type-create", createadjustedRouter);
    app.use("/home", createHomeRouter);
    app.use("/starting", createStartingRouter);
    app.use("/sa-create", createRouter);
    app.use("/sa-edit", editRouter);
    app.use("/", sitesRouter)
}
module.exports = route;

