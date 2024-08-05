const pool = require('../../config/db');

class Find_Account_H {
    async findAccount({id_card, id_account, date_created_account, type_of_saving}) {
        try {
            // return id_account, type_of_saving, customer_name, balance
        }
        catch {
            console.error('Error find account:', err);
            throw err;
        }
    }
}