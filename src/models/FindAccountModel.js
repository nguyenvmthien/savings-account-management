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
                SELECT account.acc_id, account.type, customer.name, balance.principal + balance.interest AS balance
                FROM account 
                JOIN customer ON account.cus_id = customer.cus_id
                JOIN regulation ON account.type = regulation.type AND account.apply_date = regulation.apply_date
                JOIN balance ON balance.acc_id = account.acc_id
                WHERE 1=1`;

            const params = [];
            // check if the parameter is not null, may be use lib,...
            
            console.log(id_card, id_account, date_created_account, type_of_saving);
            console.log(id_card !== null, id_account !== null, date_created_account !== null, type_of_saving !== null);
            console.log(id_card === null, id_account === null, date_created_account === null, type_of_saving === null);
            console.log(id_card != null, id_account != null, date_created_account != null, type_of_saving != null);
            console.log(id_card == null, id_account == null, date_created_account == null, type_of_saving == null);
            
            if (id_card) {
                baseQuery += ' AND customer.cus_id = ?';
                params.push(id_card);
            }
            if (id_account) {
                baseQuery += ' AND account.acc_id = ?';
                params.push(id_account);
            }
            if (date_created_account) {
                baseQuery += ' AND account.open_date = ?';
                params.push(date_created_account);
            }
            if (type_of_saving) {
                baseQuery += ' AND account.type = ?';
                params.push(type_of_saving);
            }
            console.log(baseQuery);
            const [rows, fields] = await pool.execute(baseQuery, params);
            return rows;
        } catch (err) {
            console.error('Error finding account:', err);
            throw err;
        }
    }
}

module.exports = new Find_Account_H();
