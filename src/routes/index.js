const changeTypeRouter = require("./changetype");
const sitesRouter = require("./sites")
const savingAccountRouter = require("./sa")
function route(app) {
    app.use("/change-type", changeTypeRouter);
    app.use("/sa", savingAccountRouter);
    app.use("/", sitesRouter)
}
module.exports = route;

