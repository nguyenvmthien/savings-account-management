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
                        SELECT a.open_date, r.min_dep_money
                        FROM account a join regulation r on a.type = r.type
                        WHERE a.acc_id = ? 
                        ORDER BY a.open_date DESC
                        LIMIT 1;
                        `,
                        [id_account],
                    );

                    console.log('get open date');
                    //insert new deposit transaction
                    // print to check condition if
                    console.log(money_deposit);
                    console.log(account[0].min_dep_money);
                    console.log(deposit_date);
                    console.log(account[0].open_date);
                    if (
                        money_deposit >= account[0].min_des_money &&
                        deposit_date > account[0].open_date
                    ) {
                        console.log('check money and date successful');
                        const dep_id = `DEP${Math.floor(Math.random() * 100000)
                            .toString()
                            .padStart(5, '0')}`;
                        console.log('generate dep_id successful');
                        await connection.execute(
                            'INSERT INTO deposit (dep_id, acc_id, dep_money, dep_date) VALUES (?, ?, ?, ?);',
                            [dep_id, id_account, money_deposit, deposit_date],
                        );

                        console.log('insert deposit successful');

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
                return { message: 'fail' };
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