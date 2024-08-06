const pool = require('../../config/db');

class Find_Account_H {
    async findAccount({
        id_card,
        id_account,
        date_created_account,
        type_of_saving,
    }) {
        try {
            const [rows, fields] = await pool.execute(
                `
                SELECT acc_id, account.cus_id, name, address, init_money, account.type, apply_date, open_date, close_date
                FROM account 
                JOIN customer ON account.cus_id = customer.cus_id
                JOIN regulation ON account.type = regulation.type AND account.apply_date = regulation.applay_date
                WHERE acc_id = ? AND account.cus_id = ? AND account.open_date = ? AND account.type = ?`,
                [id_card, id_account, date_created_account, type_of_saving],
            );
            return rows;
            // return id_account, type_of_saving, customer_name, balance
        } catch {
            console.error('Error find account:', err);
            throw err;
        }
    }
}
