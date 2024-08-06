const pool = require('../../config/db');

class Analyze_Monthly_H {
    async getAnalyzeMonthly({ month, year, type_of_saving }) {
        try {
            // return date, number_of_new_account, number_of_closed_account, difference
        } catch (err) {
            console.error('Error getting analyze daily:', err);
            throw err;
        }
    }
}
