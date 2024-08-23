const pool = require('../config/db');

class Account_H {
    // OK
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
                console.log('begin transaction');
                // Check if the customer already exists
                const [existingCustomer] = await connection.execute(
                    'SELECT * FROM customer WHERE cus_id = ?',
                    [id_card],
                );

                // check infor of customer from existingCustomer
                if (
                    existingCustomer[0].name != customer_name ||
                    existingCustomer[0].address != customer_address
                ) {
                    console.log('customer information is not correct');
                    return { message: 'fail' };
                }

                if (existingCustomer.length === 0) {
                    // Insert the new customer
                    const result = await connection.execute(
                        'INSERT INTO customer (cus_id, name, address) VALUES (?, ?, ?)',
                        [id_card, customer_name, customer_address],
                    );
                    console.log(result, 'inserted new customer');

                    console.log('inserted new customer');
                }

                // Get the apply_date from the regulation table based on date_created
                const [regulation] = await connection.execute(
                    `
                    SELECT r.apply_date 
                    FROM regulation r 
                    WHERE r.type = ? AND r.apply_date <= ? 
                    ORDER BY r.apply_date DESC 
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

                const apply_date = regulation[0].apply_date;

                console.log(apply_date, 'get apply_date');
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
                    'INSERT INTO balance (acc_id, principal, interest) VALUES (?, ?, 0)',
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
                connection.release();
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
                return { message: 'success' };
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
            return { message: 'fail' };
        }
    }

    // NEED CHECK WHEN b.interest IS NULL
    async getInformationByIDAccount(id_account) {
        console.log('id in model: ' + id_account);
        try {
            // Query to get account information, including customer details, regulation info, and balance
            const query = `
                SELECT
                    c.cus_id AS id_card,
                    c.name AS customer_name,
                    c.address AS customer_address,
                    a.acc_id AS id_account,
                    CONVERT_TZ(a.open_date, '+00:00', @@session.time_zone) AS date_created,
                    a.type AS type_of_saving,
                    CONVERT_TZ(a.apply_date, '+00:00', @@session.time_zone) AS apply_date,
                    r.interest_rate,
                    b.principal AS principal,
                    b.interest AS interest,
                    a.init_money AS init_money
                FROM account a
                JOIN customer c ON a.cus_id = c.cus_id
                JOIN regulation r ON a.type = r.type 
                    AND CONVERT_TZ(a.apply_date, '+00:00', @@session.time_zone) = CONVERT_TZ(r.apply_date, '+00:00', @@session.time_zone)
                JOIN balance b ON a.acc_id = b.acc_id
                WHERE a.acc_id = ?;
            `;

            // Execute the query
            const [rows, fields] = await pool.execute(query, [id_account]);
            // Check if the account exists and return the information
            console.log(rows);
            if (rows.length === 0) {
                throw new Error('Account not found.');
            }

            return rows[0];
        } catch (err) {
            console.error('Error searching account:', err);
            throw err;
        }
    }

    // OK
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

    // OK
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

    // OK
    async getNewestIDAccount() {
        // If temp is empty -> update temp by newest id in account + 1, Update status empty -> in-use and return newest_id in temp.
        // If temp is not empty
        // If exist empty id in temp -> return empty smallest id in temp
        // Else
        // -> add new_id in temp by newest current id in account + 1
        // -> return newest_id in temp. Update status empty -> in-use

        try {
            // get current datetime
            const currentDateTime = new Date().toISOString().replace(/[TZ]/g, ' ');
            console.log(currentDateTime);
            // get id in temp_id_account has in_use status = 0
            const sql = `
                SELECT id_account
                FROM temp_id_account
                WHERE in_use = 0;
            `;

            const [rows1, fields1] = await pool.execute(sql);
            if (rows1.length > 0) {
                // update status in_use
                const sql1 = `
                    UPDATE temp_id_account
                    SET in_use = 1, created_at = ?
                    WHERE id_account = ?;
                `;

                await pool.execute(sql1, [
                    currentDateTime,
                    rows1[0].id_account
                ]);
                return rows1[0].id_account;
            } else {
                // get newest id_account
                const query1 = `SELECT MAX(acc_id) AS newest_id_account FROM account WHERE acc_id LIKE 'MS%' AND LENGTH(acc_id) = 12;`;
                const [rows2, fields2] = await pool.execute(query1);

                const query2 = `SELECT MAX(id_account) AS newest_id_account FROM temp_id_account;`;
                const [rows3, fields3] = await pool.execute(query2);

                var pre_id_account = rows2[0].newest_id_account;
                if (rows3.length !== 0) {
                    // compare newest id_account in account and newest id_account in temp_id_account
                    const temp1 = rows2[0].newest_id_account;
                    const temp2 = rows3[0].newest_id_account;

                    if (temp2 > temp1) {
                        pre_id_account = temp2;
                    }
                }
                // Split id_account into prefix and number
                const prefix = 'MS';
                const number = pre_id_account.slice(prefix.length); // Slice after the prefix
                // Increase id_account
                const next_number = (parseInt(number, 10) + 1)
                    .toString()
                    .padStart(number.length, '0');
                const id_account = prefix + next_number;

                // add new_id in temp_id_account
                const sql2 = `
                    INSERT INTO temp_id_account (id_account, in_use, created_at)
                    VALUES (?, 1, ?);
                `;

                await pool.execute(sql2, [id_account, currentDateTime]);
                console.log(id_account);
                return id_account;
            }
        } catch (err) {
            return { message: 'fail' };
            // console.error('Error getting biggest id_account:', err);
            // throw err;
        }
    }

    // NEED CHECK AGAIN.
    async getCurrentBalance(id_account, withdraw_date) {
        try {
            // Validate input
            if (!id_account || !withdraw_date) {
                throw new Error('Account ID and withdrawal date are required.');
            }

            // Query to retrieve necessary account and balance information
            const query = `
                SELECT
                    a.type,
                    a.open_date,
                    b.principal,
                    r.interest_rate,
                    r.min_wit_time AS min_wit_date,
                    (
                        CASE 
                            WHEN a.type = 'non-term' THEN (
                                SELECT COALESCE(MAX(dep.dep_date), a.open_date)
                                FROM deposit dep
                                WHERE dep.acc_id = a.acc_id
                            )
                            ELSE a.open_date
                        END
                    ) AS last_deposit_date
                FROM account a
                JOIN balance b ON a.acc_id = b.acc_id
                JOIN regulation r ON a.type = r.type AND a.apply_date = r.apply_date
                WHERE a.acc_id = ?;
            `;

            const [rows] = await pool.execute(query, [id_account]);

            if (rows.length === 0) {
                throw new Error('Account not found.');
            }

            const {
                type,
                open_date,
                principal,
                last_deposit_date,
                interest_rate,
                min_wit_date,
            } = rows[0];

            // Calculate the difference between the withdrawal date and the last deposit date
            const openDate = new Date(open_date);
            const lastDepositDate = new Date(last_deposit_date);
            const withdrawDate = new Date(withdraw_date);
            const diffTimeCheck = Math.abs(withdrawDate - lastDepositDate);
            const diffDaysCheck = Math.ceil(
                diffTimeCheck / (1000 * 60 * 60 * 24),
            ); // Difference in days
            const diffTime = Math.abs(withdrawDate - openDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

            // If the difference in days is greater than or equal to the minimum withdrawal date
            let totalAmount = principal;

            if (diffDaysCheck >= min_wit_date) {
                let interest = 0;

                if (type === 'Non-term') {
                    // For non-term accounts: interest = principal * interest_rate
                    interest = principal * (interest_rate / 100);
                } else {
                    // For fixed-term accounts: interest = principal * interest_rate * [(withdraw_date - last_deposit_date) / x]
                    // Extract the term in months from the type string
                    const termMatch = type.match(/(\d+)\s*month/);
                    const months = termMatch ? parseInt(termMatch[1]) : 1; // Default to 1 month if parsing fails

                    // get int number of maturities
                    const number_of_maturities = Math.floor(
                        diffDays / (months * 30),
                    );

                    // Calculate interest based on the term
                    interest =
                        principal *
                        (interest_rate / 100) *
                        number_of_maturities; // Approximating 1 month as 30 days
                }

                totalAmount += interest;
            }

            return { totalAmount, lastDepositDate };
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
                    b.principal + b.interest AS balance
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

    async getCurrentPrincipal(id_account) {
        try {
            // Validate the id_account input
            if (!id_account) {
                throw new Error('Account ID is required.');
            }

            const query = `
                SELECT principal
                FROM balance
                WHERE acc_id = ?;
            `;

            // Execute the query
            const [rows, fields] = await pool.execute(query, [id_account]);

            // Check if the account exists and return the current balance
            if (rows.length === 0) {
                throw new Error('Account not found.');
            }

            return rows[0].principal;
            // Get current balance of account
        } catch (err) {
            console.error('Error getting current balance:', err);
            throw err;
        }
    }
}

module.exports = new Account_H();