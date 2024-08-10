class API_Controller {
    createReportDailyAPI(req, res) {
        return;
    }

    createReportMonthlyAPI(req, res) {
        return;
    }

    getMinDepMoneyAndMinWithDaysAPI(req, res) {
        return;
    }

    async getInterestRateAPI(req, res) {
        console.log(req.query.type);

        if (Object.keys(req.query).length === 0) {
            console.log('No data');
            return;
        }

        const typeOfSaving = req.query.type;
        console.log(typeOfSaving);
        // try {
        //     const result = await accountModel.getInterestRate(typeOfSaving);
        //     console.log(result);
        //     res.json(result);
        // } catch (error) {
        //     res.status(500).json({ error: error.message });
        // }
    }

    getNewestIDAccountAPI(req, res) {
        return;
    }

    getInformationAPI(req, res) {
        // var id_account = req.body.id_account;
        if(req.originalUrl == "/sa/edit")
            res.redirect("/sa/edit/account");
        else if(req.originalUrl == "/sa/deposit")
            res.redirect("/sa/deposit/account");
        else if(req.originalUrl == "/sa/withdraw")
            res.redirect("/sa/withdraw/account");
        else 
            console.log("Routing error");
        return;
    }

    getCurrentPrincipalAPI(req, res) {
        return;
    }

    findAccountAPI(req, res) {
        return;
    }

    getCurrentBalanceAPI(req, res) {
        return;
    }
}

module.exports = new API_Controller();