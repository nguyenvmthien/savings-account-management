const pool = require('../config/db');
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

            // const query = `
            //     SELECT 
            //         account.type AS type_of_saving, 
            //         COALESCE(SUM(CASE WHEN deposit.dep_date = ? THEN deposit.dep_money ELSE 0 END), 0) + 
            //         COALESCE(SUM(CASE WHEN account.open_date = ? THEN account.init_money ELSE 0 END), 0) AS total_income, 
            //         COALESCE(SUM(CASE WHEN withdraw.wit_date = ? THEN withdraw.wit_money ELSE 0 END), 0) AS total_expense, 
            //         COALESCE(SUM(CASE WHEN deposit.dep_date = ? THEN deposit.dep_money ELSE 0 END), 0) + 
            //         COALESCE(SUM(CASE WHEN account.open_date = ? THEN account.init_money ELSE 0 END), 0) - 
            //         COALESCE(SUM(CASE WHEN withdraw.wit_date = ? THEN withdraw.wit_money ELSE 0 END), 0) AS difference
            //     FROM 
            //         account
            //     LEFT JOIN 
            //         deposit ON account.acc_id = deposit.acc_id
            //     LEFT JOIN 
            //         withdraw ON account.acc_id = withdraw.acc_id 
            //     WHERE deposit.dep_date = ? OR account.open_date = ? OR withdraw.wit_date = ?
            //     GROUP BY 
            //         account.type;
            // `;
            const query_a = `
                SELECT a.type as type_of_saving, SUM(a.init_money) as total_income, 0 as total_expense, SUM(a.init_money) as difference
                FROM account a
                WHERE a.open_date = ?
                GROUP BY a.type;
            `
            const [total_income_a] = await pool.execute(query_a, [date]);
            // get total deposit
            const query_b = `
                SELECT a.type as type_of_saving, SUM(d.dep_money) as total_income, 0 as total_expense, SUM(d.dep_money) as difference
                FROM account a
                JOIN deposit d ON a.acc_id = d.acc_id
                WHERE d.dep_date = ?
                GROUP BY a.type;
            `
            const [total_income_b] = await pool.execute(query_b, [date]);
            // get total expense
            const query_c = `
                SELECT a.type as type_of_saving, 0 as total_income, SUM(w.wit_money) as total_expense, -SUM(w.wit_money) as difference
                FROM account a
                JOIN withdraw w ON a.acc_id = w.acc_id
                WHERE w.wit_date = ?
                GROUP BY a.type;
            `
            const [total_expense_c] = await pool.execute(query_c, [date]);
            // union total_income_a and total_income_b, total_expense_c
            let rows = total_income_a.concat(total_income_b).concat(total_expense_c);
            let result = [];
            let map = new Map();
            for (const item of rows) {
                if (!map.has(item.type_of_saving)) {
                    map.set(item.type_of_saving, true);    // set any value to Map
                    result.push({
                        type_of_saving: item.type_of_saving,
                        total_income: item.total_income,
                        total_expense: item.total_expense,
                        difference: item.difference
                    });
                } else {
                    for (const r of result) {
                        if (r.type_of_saving === item.type_of_saving) {
                            r.total_income += item.total_income;
                            r.total_expense += item.total_expense;
                            r.difference += item.difference;
                        }
                    }
                }
            }
            rows = result;
            return rows;
        } catch (err) {
            console.error('Error getting analyze daily:', err);
            throw err;
        }
    }
}

module.exports = new Analyze_Daily_H();
