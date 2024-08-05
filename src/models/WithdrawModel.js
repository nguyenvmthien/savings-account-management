const pool = require('../../config/db');

class Withdraw_H {
    async withdraw({id_account, money_withdraw, withdraw_date }) {
        try {
            // Insert a new withdraw into the database
            // Update into balance table
            // Return the withdraw information
        }
        catch {
            console.error('Error withdraw:', err);
            throw err;
        }
    }

    async getAllWithdrawMoney() {
        try {
            // Get all withdraw money
        }
        catch (err) {
            console.error('Error getting all withdraw money:', err);
            throw err;
        }
    }
}