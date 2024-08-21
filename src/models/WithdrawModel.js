const pool = require('../config/db');

class Withdraw_H {
    // async withdraw({ id_account, money_withdraw, withdraw_date }) {
    //     try {
    
    //     } catch {
    //         console.error('Error withdraw:', err);
    //         throw err;
    //     }
    // }

    async withdraw({ id_account, money_withdraw, withdraw_date }) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            const [[{ acc_exists }]] = await connection.execute(
                'SELECT COUNT(*) as acc_exists FROM account WHERE acc_id = ?;',
                [id_account]
            );
    
            if (!acc_exists) throw new Error('Account does not exist');
    
            const [[accountDetails], [balanceDetails]] = await Promise.all([
                connection.execute(
                    'SELECT a.open_date, r.interest_rate, a.type ' +
                    'FROM account a ' +
                    'JOIN regulation r ON a.type = r.type ' +
                    'WHERE a.acc_id = ?;', 
                    [id_account]
                ),
                connection.execute(
                    'SELECT principal, interest FROM balance WHERE acc_id = ?;',
                    [id_account]
                )
            ]);
    
            const { open_date, interest_rate, type: account_type } = accountDetails[0];
            let { principal, interest } = balanceDetails[0];
    
            const time_difference = Math.floor(
                (new Date(withdraw_date) - new Date(open_date)) / (1000 * 60 * 60 * 24)
            );
    
            if (new Date(withdraw_date) <= new Date(open_date)) 
                throw new Error('Invalid withdrawal date');
    
            if (account_type === 'Non-term') {
                if (money_withdraw > principal + interest) 
                    throw new Error('Error: Insufficient funds');
    
                const withdraw_id = `WIT${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
                await connection.execute(
                    'INSERT INTO withdraw (wit_id, acc_id, wit_money, wit_date) VALUES (?, ?, ?, ?);',
                    [withdraw_id, id_account, money_withdraw, withdraw_date]
                );
    
                if (time_difference >= 30) {
                    principal -= money_withdraw / (1 + interest_rate);
                    interest -= (money_withdraw * interest_rate) / (1 + interest_rate);
                } else {
                    principal -= money_withdraw;
                }
    
                await connection.execute(
                    'UPDATE balance SET principal = ?, interest = ? WHERE acc_id = ?;',
                    [principal, interest, id_account]
                );
    
                if (Math.floor(principal + interest) === 0) {
                    await connection.execute(
                        'UPDATE account SET close_date = ? WHERE acc_id = ?;',
                        [withdraw_date, id_account]
                    );
                }
            } else {
                const [[{ month_number }]] = await connection.execute(
                    'SELECT CAST(SUBSTRING_INDEX(?, " ", 1) AS UNSIGNED) AS month_number;',
                    [account_type]
                );
                const limit_days = month_number * 30;
    
                if (time_difference < limit_days || money_withdraw > principal + interest) 
                    throw new Error('Error: Insufficient funds or time');
    
                const number_of_maturities = Math.floor(time_difference / limit_days);
                interest = principal * number_of_maturities * interest_rate;
    
                await connection.execute(
                    'UPDATE balance SET interest = ? WHERE acc_id = ?;',
                    [interest, id_account]
                );
    
                const withdraw_id = `WIT${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
                const withdraw_money = principal + interest;
    
                await connection.execute(
                    'INSERT INTO withdraw (wit_id, acc_id, wit_money, wit_date) VALUES (?, ?, ?, ?);',
                    [withdraw_id, id_account, withdraw_money, withdraw_date]
                );
    
                await connection.execute(
                    'UPDATE balance SET principal = 0, interest = 0 WHERE acc_id = ?;',
                    [id_account]
                );
    
                await connection.execute(
                    'UPDATE account SET close_date = ? WHERE acc_id = ?;',
                    [withdraw_date, id_account]
                );
            }

            await connection.commit();
        } catch (err) {
            await connection.rollback();
            console.error('Error during transaction:', err);
            throw err;
        } finally {
            connection.release();
        }
    }

    async getAllWithdrawTransaction() {
        try {
            // Get all withdraw money
            const query = `
                SELECT COUNT(*) AS all_withdraw_transation
                FROM withdraw;
            `;

            const [rows, fields] = await pool.execute(query);

            // Access the first row and the all_deposit_transaction column
            return rows[0].all_withdraw_transation;
        } catch (err) {
            console.error('Error getting all withdraw money:', err);
            throw err;
        }
    }
}