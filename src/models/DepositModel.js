const pool = require('../../config/db');

let depositTransactionCount = 0;

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
                    'SELECT * FROM account WHERE acc_id = ?',
                    [id_account],
                );

                if (existingAccount.length > 0) {
                    const [account] = await connection.execute(
                        `
                        SELECT a.open_date
                        FROM account a
                        WHERE a.acc_id = ? 
                        ORDER BY a.open_date DESC
                        LIMIT 1
                        `,
                        [id_account],
                    );

                    const p_open_date = account[0].open_date;
                    if (money_deposit > 500000 && deposit_date > p_open_date) {
                        const dep_id = `DEP${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;

                        await connection.execute(
                            'INSERT INTO deposit (dep_id, acc_id, dep_money, dep_date) VALUES (?, ?, ?, ?)',
                            [dep_id, id_account, money_deposit, deposit_date],
                        );

                        const [balance] = await connection.execute(
                            `
                                SELECT a.cur_balance
                                FROM balance b
                                WHERE b.acc_id = ? 
                                ORDER BY b.open_date DESC
                                LIMIT 1
                                `,
                            [id_account],
                        );

                        const p_cur_balance =
                            balance[0].cur_balance + money_deposit;

                        await connection.execute(
                            'UPDATE balance SET cur_balance = ? WHERE acc_id = ?',
                            [p_cur_balance, id_account],
                        );

                        await connection.commit();
                    }
                } 
            } catch (err) {
                await connection.rollback();
                console.error('Error during transaction:', err);
                throw err;
            } finally {
                connection.release();
            }
        } catch (err){
            console.error('Error deposit:', err);
            throw err;
        }
    }

    async getAllDepositTransaction() {
        try {
            return depositTransactionCount;
        } catch (err) {
            console.error('Error getting all deposit transaction:', err);
            throw err;
        }
    }
}
