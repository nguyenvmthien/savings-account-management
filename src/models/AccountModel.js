const pool = require('../../config/db');

class Account_H {
    async create({
        id_card,
        customer_name,
        customer_address,
        id_account,
        money,
        type_of_saving,
        date_created,
    }) {
        try {
            // Insert a new customer into the database if customer doesn't exist
            // Insert a new account into the database
            // Update or Insert into balance table
        } catch (err) {
            console.error('Error creating account:', err);
            throw err;
        }
    }

    async edit({
        id_card,
        customer_name,
        customer_address,
        id_account,
        money,
        type_of_saving,
        date_created,
    }) {
        try {
            // Update the account or customer in the database
        } catch (err) {
            console.error('Error editing account:', err);
            throw err;
        }
    }

    async getInformationByIDAccount(id_account) {
        try {
            // Search for an account by id_account.
            // Return id_card, customer_name, customer_address, id_account, date_created, type_of_saving, interest_rate, balance
        } catch (err) {
            console.error('Error searching account:', err);
            throw err;
        }
    }

    async getTotalOpenedAccount() {
        try {
            // Get total opened account

            const query = `
                SELECT COUNT(*) AS total_opened_account
                FROM account
                WHERE close_date IS NULL;
            `;

            const [rows, fields] = await pool.execute(query);

            // Access the first row and the total_opened_account column
            return rows[0].total_opened_account;
        } catch (err) {
            console.error('Error getting total opened account:', err);
            throw err;
        }
    }

    async getNewestIDAccount() {
        try {
            const query = `
                SELECT MAX(acc_id) AS newest_id_account
                FROM account;
            `;

            const [rows, fields] = await pool.execute(query);

            return rows[0].newest_id_account;
            // get newest id_account
        } catch (err) {
            console.error('Error getting biggest id_account:', err);
            throw err;
        }
    }

    async getCurrentBalance(id_account) {
        try {
            // Validate the id_account input
            if (!id_account) {
                throw new Error('Account ID is required.');
            }

            const query = `
                SELECT cur_balance
                FROM balance
                WHERE acc_id = ?;
            `;

            // Execute the query
            const [rows, fields] = await pool.execute(query, [id_account]);

            // Check if the account exists and return the current balance
            if (rows.length === 0) {
                throw new Error('Account not found.');
            }

            return rows[0].cur_balance;
            // Get current balance of account
        } catch (err) {
            console.error('Error getting current balance:', err);
            throw err;
        }
    }

    async getLatestAccounts(numOfAccounts) {
        try {
            // Get latest accounts
            // Validate the numOfAccounts input
            if (typeof numOfAccounts !== 'number' || numOfAccounts <= 0) {
                throw new Error('Number of accounts must be a positive integer.');
            }

            const query = `
                SELECT
                    a.acc_id,
                    a.type AS type_of_saving,
                    c.name AS customer_name,
                    b.cur_balance AS balance
                FROM account a
                JOIN customer c ON a.cus_id = c.cus_id
                JOIN balance b ON a.acc_id = b.acc_id
                ORDER BY a.open_date DESC
                LIMIT ?;
            `;

            // Execute the query with parameter
            const [rows, fields] = await pool.execute(query, [numOfAccounts]);

            return rows;
            // Return id_account, type_of_saving, customer_name, balance
        } catch (err) {
            console.error('Error getting latest accounts:', err);
            throw err;
        }
    }
}

module.exports = new Accounts();
