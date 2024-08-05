const pool = require('../../config/db');

class Deposit_H {
    async deposit({id_account, money_deposit, deposit_date }) {
        try {
            // Insert a new deposit into the database
            // Update into balance table
            // Return the deposit information
        }
        catch {
            console.error('Error deposit:', err);
            throw err;
        }
    }

    async getAllDepositTransaction() {
        try {
            // Get all deposit money
        }
        catch (err) {
            console.error('Error getting all deposit money:', err);
            throw err;
        }
    }
}