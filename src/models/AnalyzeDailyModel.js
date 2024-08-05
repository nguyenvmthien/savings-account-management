const pool = require('../../config/db');

class Analyze_Daily_H {
    async getAnalyzeDaily({date}) {
        try {
            // return type_of_saving, total_income, total_expense, difference
        }
        catch (err) {
            console.error('Error getting analyze daily:', err);
            throw err;
        }
    }
}