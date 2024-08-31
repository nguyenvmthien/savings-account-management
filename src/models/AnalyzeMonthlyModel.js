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
            // const query = `
            //     SELECT 
            //         DATE_FORMAT(date_table.date, '%Y-%m-%d') AS date,
            //         (SUM(CASE WHEN account.open_date = date_table.date THEN 1 ELSE 0 END), 0) AS number_of_new_account,
            //         (SUM(CASE WHEN account.close_date = date_table.date THEN 1 ELSE 0 END), 0) AS number_of_closed_account,
            //         (SUM(CASE WHEN account.open_date = date_table.date THEN 1 ELSE 0 END), 0) - 
            //         (SUM(CASE WHEN account.close_date = date_table.date THEN 1 ELSE 0 END), 0) AS difference
            //     FROM 
            //         (SELECT DISTINCT open_date AS date FROM account 
            //         UNION ALL
            //         SELECT DISTINCT close_date FROM account) AS date_table
            //     LEFT JOIN 
            //         account ON date_table.date IN (account.open_date, account.close_date)
            //     WHERE 
            //         account.type = ?
            //         AND DATE_FORMAT(date_table.date, '%Y-%m') = ?
            //     GROUP BY 
            //         date_table.date
            //     ORDER BY 
            //         date_table.date ASC;
            // `;

            // const params = [
            //     type_of_saving,
            //     `${year}-${month}`,
            // ];
            // const [rows, fields] = await pool.execute(query, params);
            // console.log(rows);
            const query_o = `
                SELECT
                    DATE_FORMAT(a.open_date, '%Y-%m-%d') AS date,
                    COUNT(a.acc_id) AS number_of_new_account,
                    0 AS number_of_closed_account,
                    COUNT(a.acc_id) AS difference
                FROM account a
                WHERE a.type = ? AND DATE_FORMAT(a.open_date, '%Y-%m') = ?
                GROUP BY DATE_FORMAT(a.open_date, '%Y-%m-%d')
                ORDER BY DATE_FORMAT(a.open_date, '%Y-%m-%d') ASC;
            `;
            const params = [
                type_of_saving,
                `${year}-${month}`,
            ];
            const query_c = `
                SELECT
                    DATE_FORMAT(a.close_date, '%Y-%m-%d') AS date,
                    0 AS number_of_new_account,
                    COUNT(a.acc_id) AS number_of_closed_account,
                    -COUNT(a.acc_id) AS difference
                FROM account a
                WHERE a.type = ? AND DATE_FORMAT(a.close_date, '%Y-%m') = ?
                GROUP BY DATE_FORMAT(a.close_date, '%Y-%m-%d')
                ORDER BY DATE_FORMAT(a.close_date, '%Y-%m-%d') ASC;
            `;
            const [new_account] = await pool.execute(query_o, params);
            const [closed_account] = await pool.execute(query_c, params);
            let rows = new_account.concat(closed_account);
            console.log(new_account, closed_account);
            // unique date
            let result = [];
            let map = new Map();
            for (const item of rows) {
                if (!map.has(item.date)) {
                    map.set(item.date, true);
                    result.push({
                        date: item.date,
                        number_of_new_account: item.number_of_new_account,
                        number_of_closed_account: item.number_of_closed_account,
                        difference: item.difference
                    });
                } else {
                    for (const r of result) {
                        if (r.date === item.date) {
                            r.number_of_new_account += item.number_of_new_account;
                            r.number_of_closed_account += item.number_of_closed_account;
                            r.difference += item.difference;
                        }
                    }
                }
            }
            for (let i = 0; i < result.length; i++) {
                for (let j = i + 1; j < result.length; j++) {
                    if (result[i].date > result[j].date) {
                        let temp = result[i];
                        result[i] = result[j];
                        result[j] = temp;
                    }
                }
            }
            rows = result;
            return rows;
            // return date, number_of_new_account, number_of_closed_account, difference
        } catch (err) {
            console.error('Error getting analyze daily:', err);
            throw err;
        }
    }
}

module.exports = new Analyze_Monthly_H();