const pool = require('../../config/db');
const moment = require('moment');
class Analyze_Daily_H {
    async getAnalyzeDaily({ date }) {
        try {
            // Validate the date input
            if (!date || !moment(date, 'YYYY-MM-DD', true).isValid()) {
                throw new Error(
                    'Invalid date format. Expected format: YYYY-MM-DD',
                );
            }

            const query = `
                SELECT 
                    account.type AS type_of_saving, 
                    COALESCE(SUM(deposit.dep_money), 0) AS total_income, 
                    COALESCE(SUM(withdraw.wit_money), 0) AS total_expense, 
                    COALESCE(SUM(deposit.dep_money), 0) - COALESCE(SUM(withdraw.wit_money), 0) AS difference
                FROM account
                LEFT JOIN deposit ON account.acc_id = deposit.acc_id AND deposit.dep_date = ?
                LEFT JOIN withdraw ON account.acc_id = withdraw.acc_id AND withdraw.wit_date = ?
                GROUP BY account.type;
            `;

            const [rows, fields] = await pool.execute(query, [date, date]);
            return rows;
            // return type_of_saving, total_income, total_expense, difference
        } catch (err) {
            console.error('Error getting analyze daily:', err);
            throw err;
        }
    }
}

module.exports = new Analyze_Daily_H();