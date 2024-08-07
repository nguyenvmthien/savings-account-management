const pool = require('../../config/db');
const moment = require('moment');

class Analyze_Monthly_H {
    async getAnalyzeMonthly({ month, year, type_of_saving }) {
        try {
            // Validate the month and year inputs
            if (
                !month ||
                !year ||
                !moment(`${year}-${month}`, 'YYYY-MM', true).isValid()
            ) {
                throw new Error(
                    'Invalid month or year format. Expected format: MM and YYYY',
                );
            }

            const startDate = `${year}-${month}-01`;
            const endDate = moment(startDate)
                .endOf('month')
                .format('YYYY-MM-DD');

            const query = `
            SELECT 
                DATE_FORMAT(account.open_date, '%Y-%m-%d') AS date,
                SUM(CASE WHEN account.open_date BETWEEN ? AND ? THEN 1 ELSE 0 END) AS number_of_new_account,
                SUM(CASE WHEN account.close_date BETWEEN ? AND ? THEN 1 ELSE 0 END) AS number_of_closed_account,
                SUM(CASE WHEN account.open_date BETWEEN ? AND ? THEN 1 ELSE 0 END) - 
                SUM(CASE WHEN account.close_date BETWEEN ? AND ? THEN 1 ELSE 0 END) AS difference
            FROM account
            WHERE account.type = ?
            GROUP BY DATE_FORMAT(account.open_date, '%Y-%m-%d');
            `;

            const params = [
                startDate,
                endDate,
                startDate,
                endDate,
                startDate,
                endDate,
                startDate,
                endDate,
                type_of_saving,
            ];
            const [rows, fields] = await pool.execute(query, params);
            return rows;
            // return date, number_of_new_account, number_of_closed_account, difference
        } catch (err) {
            console.error('Error getting analyze daily:', err);
            throw err;
        }
    }
}

module.exports = new Analyze_Monthly_H();
