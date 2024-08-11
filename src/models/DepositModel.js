const pool = require('../../config/db');

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
                // if account exists
                if (existingAccount.length > 0) {
                    //get the opened_date
                    const [account] = await connection.execute(
                        `
                        SELECT a.open_date
                        FROM account a
                        WHERE a.acc_id = ? 
                        ORDER BY a.open_date DESC
                        LIMIT 1;
                        `,
                        [id_account],
                    );

                    //insert new deposit transaction
                    const p_open_date = account[0].open_date;
                    if (money_deposit > 500000 && deposit_date > p_open_date) {
                        const dep_id = `DEP${Math.floor(Math.random() * 100000)
                            .toString()
                            .padStart(5, '0')}`;

                        await connection.execute(
                            'INSERT INTO deposit (dep_id, acc_id, dep_money, dep_date) VALUES (?, ?, ?, ?);',
                            [dep_id, id_account, money_deposit, deposit_date],
                        );

                        const [balance] = await connection.execute(
                            `
                                SELECT a.principle
                                FROM balance b
                                WHERE b.acc_id = ? 
                                ORDER BY b.open_date DESC
                                LIMIT 1;
                                `,
                            [id_account],
                        );

                        const cur_principle =
                            balance[0].principle + money_deposit;

                        //update account's principle
                        await connection.execute(
                            'UPDATE balance SET principle = ? WHERE acc_id = ?;',
                            [cur_principle, id_account],
                        );

                        await connection.commit();
                    }
                }
            } catch (err) {
                //throw error if there is error during the transaction
                await connection.rollback();
                console.error('Error during transaction:', err);
                throw err;
            } finally {
                //final step
                connection.release();
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
