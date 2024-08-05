const CreateHomeRouter = require("./home");
const CreateStartingRouter = require ("./starting");
function route(app) {
    app.use ("/starting/home", CreateHomeRouter);
    app.use("/starting", CreateStartingRouter);
}

module.exports = route;

