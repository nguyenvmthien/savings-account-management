const pool = require('../config/db');

class Deposit_H {
    async deposit({ id_account, money_deposit, deposit_date }) {
        try {
            // Insert a new deposit into the database
            // Update into balance table
            // Return the deposit information
            const connection = await pool.getConnection();
            await connection.beginTransaction();
            try {
                // Check if the account already exists
                const [existingAccount] = await connection.execute(
                    'SELECT * FROM account WHERE acc_id = ?;',
                    [id_account],
                );
                console.log('check exist account successful');
                // if account exists
                if (existingAccount.length > 0) {
                    //get the opened_date
                    const [account] = await connection.execute(
                        `
                        SELECT 
                            CONVERT_TZ(a.open_date, '+00:00', @@session.time_zone) as date_created, 
                            r.min_dep_money
                        FROM account a join regulation r on a.type = r.type and a.apply_date = r.apply_date
                        WHERE a.acc_id = ? 
                        ORDER BY a.open_date DESC
                        LIMIT 1;
                        `,
                        [id_account],
                    );
                    const dateCreated = new Date(account[0].date_created)
                        .toISOString()
                        .split('T')[0];
                    const depositDate = new Date(deposit_date)
                        .toISOString()
                        .split('T')[0];
                    console.log('get open date');
                    //insert new deposit transaction
                    // print to check condition if
                    console.log(money_deposit);
                    console.log(account[0].min_dep_money);
                    console.log(depositDate);
                    console.log(dateCreated);
                    console.log('Enter the condition');
                    if (
                        money_deposit >= account[0].min_dep_money &&
                        depositDate > dateCreated
                    ) {
                        console.log('check money and date successful');
                        // const dep_id = `DEP${Math.floor(Math.random() * 100000)
                        //     .toString()
                        //     .padStart(5, '0')}`;
                        const [latestdepID] = await connection.execute(
                            `
                            SELECT dep_id
                            FROM deposit
                            ORDER BY dep_id DESC
                            LIMIT 1;
                            `,
                        );

                        console.log('Latest dep_id: ', latestdepID[0].dep_id);

                        const prefix = 'DEP';

                        // Extract the numeric part of the dep_id by slicing after the prefix length
                        const number = latestdepID[0].dep_id.slice(
                            prefix.length,
                        ); // Assuming the dep_id format is 'DEPXXXXX'

                        // Increment the numeric part, convert it to a string, and pad with leading zeros to maintain length
                        const next_number = (parseInt(number, 10) + 1)
                            .toString()
                            .padStart(number.length, '0');

                        // Combine the prefix with the new numeric part to create the next dep_id
                        const dep_id = prefix + next_number;

                        console.log('Next dep_id:', dep_id);

                        console.log('generate dep_id successful');
                        await connection.execute(
                            'INSERT INTO deposit (dep_id, acc_id, dep_money, dep_date) VALUES (?, ?, ?, CONVERT_TZ(?, "+00:00", @@session.time_zone));',
                            [dep_id, id_account, money_deposit, deposit_date],
                        );

                        console.log('insert deposit successful');

                        const [balance] = await connection.execute(
                            `
                                SELECT b.principal
                                FROM balance b
                                WHERE b.acc_id = ?;
                            `,
                            [id_account],
                        );
                        const dep_money = parseFloat(money_deposit);
                        console.log('deposit money:', dep_money);
                        const cur_principal = balance[0].principal + dep_money;

                        console.log('Upated balance: ', cur_principal);
                        //update account's principle
                        await connection.execute(
                            'UPDATE balance SET principal = ? WHERE acc_id = ?;',
                            [cur_principal, id_account],
                        );
                        console.log('update balance successful');
                        await connection.commit();

                        // print to debug
                        console.log('commit successful');

                        // add the deposit information to the response
                        return { message: 'success' };
                    }
                }
            } catch (err) {
                //throw error if there is error during the transaction
                await connection.rollback();
                console.error('Error during transaction:', err);
                throw err;
            } finally {
                //release the connection
                connection.release();
                // add the deposit information to the response
                // return { message: 'fail' };
            }
        } catch (err) {
            //throw error if there is something wrong
            console.error('Error deposit:', err);
            throw err;
        }
    }

    async getAllDepositTransaction() {
        try {
            //self-explantory
            const query = `
                SELECT COUNT(*) AS all_deposit_transation
                FROM deposit;
            `;

            const [rows, fields] = await pool.execute(query);

            // Access the first row and the all_deposit_transaction column
            return rows[0].all_deposit_transation;
        } catch (err) {
            console.error('Error getting all deposit transaction:', err);
            throw err;
        }
    }
}

module.exports = new Deposit_H();
