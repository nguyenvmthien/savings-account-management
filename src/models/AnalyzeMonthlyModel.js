const pool = require('../config/db');
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
            
            console.log(startDate, endDate);
            const query = `
                SELECT 
                    DATE_FORMAT(date_table.date, '%Y-%m-%d') AS date,
                    COALESCE(SUM(CASE WHEN account.open_date = date_table.date THEN 1 ELSE 0 END), 0) AS number_of_new_account,
                    COALESCE(SUM(CASE WHEN account.close_date = date_table.date THEN 1 ELSE 0 END), 0) AS number_of_closed_account,
                    COALESCE(SUM(CASE WHEN account.open_date = date_table.date THEN 1 ELSE 0 END), 0) - 
                    COALESCE(SUM(CASE WHEN account.close_date = date_table.date THEN 1 ELSE 0 END), 0) AS difference
                FROM 
                    (SELECT DISTINCT open_date AS date FROM account 
                    UNION ALL
                    SELECT DISTINCT close_date FROM account) AS date_table
                LEFT JOIN 
                    account ON date_table.date IN (account.open_date, account.close_date)
                WHERE 
                    account.type = ?
                    AND DATE_FORMAT(date_table.date, '%Y-%m') = ?
                GROUP BY 
                    date_table.date
                ORDER BY 
                    date_table.date ASC;
            `;

            const params = [
                type_of_saving,
                `${year}-${month}`,
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
