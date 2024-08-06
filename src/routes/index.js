const createhomeRouter = require("./home");
const createstartingRouter = require ("./starting");
const createRouter = require("./create");
const createadjustedRouter = require("./changetype");
function route(app) {
    app.use("/change-type-create", createadjustedRouter);
    app.use("/starting/home", createhomeRouter);
    app.use("/starting", createstartingRouter);
    app.use("/sa-create", createRouter);
}
module.exports = route;

