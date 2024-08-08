const changeTypeRouter = require("./change_type");
const sitesRouter = require("./sites")
const savingAccountRouter = require("./sa")
const analysisRouter = require("./analysis")
function route(app) {
    app.use("/analysis", analysisRouter);
    app.use("/change-type", changeTypeRouter);
    app.use("/sa", savingAccountRouter);
    app.use("/", sitesRouter)
}
module.exports = route;

