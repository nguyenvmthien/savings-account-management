const pool = require('../../config/db');

class Withdraw_H {
    async withdraw({ id_account, money_withdraw, withdraw_date }) {
        try {
            // Insert a new withdraw into the database
            // Update into balance table
            // Return the withdraw information

            // update close_date in account table if balance < 1
        } catch {
            console.error('Error withdraw:', err);
            throw err;
        }
    }

    async getAllWithdrawTransaction() {
        try {
            // Get all withdraw money
        } catch (err) {
            console.error('Error getting all withdraw money:', err);
            throw err;
        }
    }
}
