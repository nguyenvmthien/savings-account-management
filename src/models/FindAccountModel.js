const pool = require('../config/db');

class Find_Account_H {
    async findAccount({
        id_card,
        id_account,
        date_created_account,
        type_of_saving,
    }) {
        try {
            let baseQuery = `
                SELECT account.acc_id, account.type, customer.name, balance.cur_balance
                FROM account 
                JOIN customer ON account.cus_id = customer.cus_id
                JOIN regulation ON account.type = regulation.type AND account.apply_date = regulation.apply_date
                JOIN balance ON balance.acc_id = account.acc_id
                WHERE 1=1`;

            const params = [];

            if (id_card !== null) {
                baseQuery += ' AND customer.id_card = ?';
                params.push(id_card);
            }
            if (id_account !== null) {
                baseQuery += ' AND account.acc_id = ?';
                params.push(id_account);
            }
            if (date_created_account !== null) {
                baseQuery += ' AND account.open_date = ?';
                params.push(date_created_account);
            }
            if (type_of_saving !== null) {
                baseQuery += ' AND account.type = ?';
                params.push(type_of_saving);
            }

            const [rows, fields] = await pool.execute(baseQuery, params);
            return rows;
        } catch (err) {
            console.error('Error finding account:', err);
            throw err;
        }
    }
}

module.exports = new Find_Account_H();