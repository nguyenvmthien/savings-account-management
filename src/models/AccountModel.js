const pool = require('../config/db');

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
            // Begin a transaction to ensure atomicity

            const connection = await pool.getConnection();
            await connection.beginTransaction();

            try {
                // Check if the customer already exists
                const [existingCustomer] = await connection.execute(
                    'SELECT * FROM customer WHERE cus_id = ?',
                    [id_card],
                );
                console.log(existingCustomer, 'error here');

                if (existingCustomer.length === 0) {
                    // Insert the new customer
                    await connection.execute(
                        'INSERT INTO customer (cus_id, name, address) VALUES (?, ?, ?)',
                        [id_card, customer_name, customer_address],
                    );

                    console.log('inserted new customer');
                }

                // Get the apply_date from the regulation table based on date_created
                const [regulation] = await connection.execute(
                    `
                    SELECT r.applay_date 
                    FROM regulation r 
                    WHERE r.type = ? AND r.applay_date <= ? 
                    ORDER BY r.applay_date DESC 
                    LIMIT 1
                    `,
                    [type_of_saving, date_created],
                );

                console.log(regulation, 'get regulation');

                if (regulation.length === 0) {
                    throw new Error(
                        'Regulation for the given type_of_saving not found.',
                    );
                }

                const apply_date = regulation[0].applay_date;

                // Insert the new account
                await connection.execute(
                    'INSERT INTO account (acc_id, cus_id, init_money, type, apply_date, open_date) VALUES (?, ?, ?, ?, ?, ?)',
                    [
                        id_account,
                        id_card,
                        money,
                        type_of_saving,
                        apply_date,
                        date_created,
                    ],
                );

                console.log('inserted new account');
                // Insert the initial balance
                await connection.execute(
                    'INSERT INTO balance (acc_id, cur_balance) VALUES (?, ?)',
                    [id_account, money],
                );

                console.log('inserted new balance');
                // Commit the transaction
                await connection.commit();
                console.log('commited');
            } catch (err) {
                // Rollback in case of error
                await connection.rollback();
                throw err;
            } finally {
                // Release the connection back to the pool
                if (connection) {
                    connection.release();
                    console.log('released');
                    return { message: 'success' };
                }
                console.log('done');
            }
        } catch (err) {
            console.error('Error creating account:', err);
            // throw err;
            return { message: 'fail' };
        }
    }

    async edit({ id_card, customer_name, customer_address }) {
        try {
            // Validate input
            if (!id_card || !customer_name || !customer_address) {
                throw new Error(
                    'id_card, customer_name, and customer_address are required.',
                );
            }

            // Begin a transaction to ensure atomicity
            const connection = await pool.getConnection();
            await connection.beginTransaction();

            try {
                // Update the customer information
                const [result] = await connection.execute(
                    'UPDATE customer SET name = ?, address = ? WHERE cus_id = ?',
                    [customer_name, customer_address, id_card],
                );

                // Check if the update was successful
                if (result.affectedRows === 0) {
                    throw new Error(
                        'Customer not found or no changes were made.',
                    );
                }

                // Commit the transaction
                await connection.commit();
            } catch (err) {
                // Rollback in case of error
                await connection.rollback();
                throw err;
            } finally {
                // Release the connection back to the pool
                if (connection) {
                    connection.release();
                }
            }
        } catch (err) {
            console.error('Error editing customer:', err);
            throw err;
        }
    }

    async getInformationByIDAccount(id_account) {
        try {
            // Validate input
            if (!id_account) {
                throw new Error('Account ID is required.');
            }

            // Query to get account information, including customer details, regulation info, and balance
            const query = `
                SELECT
                    c.cus_id AS id_card,
                    c.name AS customer_name,
                    c.address AS customer_address,
                    a.acc_id AS id_account,
                    a.open_date AS date_created,
                    a.type AS type_of_saving,
                    r.interest_rate,
                    b.cur_balance AS balance
                FROM account a
                JOIN customer c ON a.cus_id = c.cus_id
                JOIN regulation r ON a.type = r.type AND a.apply_date = r.applay_date
                JOIN balance b ON a.acc_id = b.acc_id
                WHERE a.acc_id = ?;
            `;

            // Execute the query
            const [rows, fields] = await pool.execute(query, [id_account]);

            // Check if the account exists and return the information
            if (rows.length === 0) {
                throw new Error('Account not found.');
            }

            return rows[0];
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

    async getTotalClosedAccount() {
        try {
            // Get total closed account

            const query = `
                SELECT COUNT(*) AS total_closed_account
                FROM account
                WHERE close_date IS NOT NULL;
            `;

            const [rows, fields] = await pool.execute(query);

            // Access the first row and the total_closed_account column
            return rows[0].total_closed_account;
        } catch (err) {
            console.error('Error getting total closed account:', err);
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

    // NEED TO UPDATE with input id_account, withdraw_date
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
                throw new Error(
                    'Number of accounts must be a positive integer.',
                );
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

module.exports = new Account_H();
