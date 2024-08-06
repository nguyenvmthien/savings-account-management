const createadjustedRouter = require("./changetype");
const sitesRouter = require("./sites")
const savingAccountRouter = require("./sa")
const  change_type_edit_Controller = require("./change_type_edit");
function route(app) {
    app.use("/change-type", change_type_edit_Controller);
    app.use("/change-type", createadjustedRouter);
    app.use("/sa", savingAccountRouter);
    app.use("/", sitesRouter)
}
module.exports = route;

