const pool = require('../config/db');

class Withdraw_H {
    // async withdraw({ id_account, money_withdraw, withdraw_date }) {
    //     try {
    //
    //     } catch {
    //         console.error('Error withdraw:', err);
    //         throw err;
    //     }
    // }

    async insertWithdraw({ id_account, wit_money, wit_date }) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try {
            // Check if the account exists
            const [existingAccount] = await connection.execute(
                'SELECT COUNT(*) as acc_exists FROM `saving-app`.`account` WHERE acc_id = ?;',
                [id_account]
            );
    
            if (existingAccount[0].acc_exists > 0) {
                // Retrieve account details
                const [accountDetails] = await connection.execute(
                    `SELECT a.open_date, r.min_wit_time, r.interest_rate, a.type 
                     FROM \`saving-app\`.account a 
                     JOIN \`saving-app\`.regulation r ON a.type = r.type 
                     WHERE a.acc_id = ?;`,
                    [id_account]
                );
    
                const p_opened_date = accountDetails[0].open_date;
                const p_interest_rate = accountDetails[0].interest_rate;
                const p_type = accountDetails[0].type;
    
                const [balanceDetails] = await connection.execute(
                    'SELECT principal, interest FROM `saving-app`.`balance` WHERE acc_id = ?;',
                    [id_account]
                );
    
                let p_principal = balanceDetails[0].principal;
                let p_interest = balanceDetails[0].interest;
    
                const time_difference = Math.floor(
                    (new Date(wit_date) - new Date(p_opened_date)) / (1000 * 60 * 60 * 24)
                );
    
                if (new Date(wit_date) > new Date(p_opened_date)) {
                    if (p_type === 'Non-term') {
                        if (wit_money <= p_principal + p_interest) {
                            const p_withdraw_id = `WIT${Math.floor(
                                Math.random() * 100000
                            )
                                .toString()
                                .padStart(5, '0')}`;
    
                            await connection.execute(
                                'INSERT INTO `saving-app`.`withdraw` (wit_id, acc_id, wit_money, wit_date) VALUES (?, ?, ?, ?);',
                                [p_withdraw_id, id_account, wit_money, wit_date]
                            );
    
                            if (time_difference >= 30) {
                                p_principal -= wit_money / (1 + p_interest_rate);
                                p_interest -= (wit_money * p_interest_rate) / (1 + p_interest_rate);
                            } else {
                                p_principal -= wit_money;
                            }
    
                            await connection.execute(
                                'UPDATE `saving-app`.`balance` SET principal = ?, interest = ? WHERE acc_id = ?;',
                                [p_principal, p_interest, id_account]
                            );
    
                            if (Math.floor(p_principal + p_interest) === 0) {
                                await connection.execute(
                                    'UPDATE `saving-app`.`account` SET close_date = ? WHERE acc_id = ?;',
                                    [wit_date, id_account]
                                );
                            }
                        } else {
                            throw new Error('Error: Insufficient funds');
                        }
                    } else {
                        // Calculate limit_days using the same logic as the the_limit_day procedure
                        const [monthNumberResult] = await connection.execute(
                            'SELECT CAST(SUBSTRING_INDEX(?, " ", 1) AS UNSIGNED) AS month_number;',
                            [p_type]
                        );
                        const limit_days = monthNumberResult[0].month_number * 30;
    
                        if (time_difference >= limit_days && wit_money <= p_principal + p_interest) {
                            const number_of_maturities = Math.floor(time_difference / limit_days);
                            p_interest = p_principal * number_of_maturities * p_interest_rate;
    
                            await connection.execute(
                                'UPDATE `saving-app`.`balance` SET interest = ? WHERE acc_id = ?;',
                                [p_interest, id_account]
                            );
    
                            const p_withdraw_id = `WIT${Math.floor(
                                Math.random() * 100000
                            )
                                .toString()
                                .padStart(5, '0')}`;
                            const p_wit_money = p_principal + p_interest;
    
                            await connection.execute(
                                'INSERT INTO `saving-app`.`withdraw` (wit_id, acc_id, wit_money, wit_date) VALUES (?, ?, ?, ?);',
                                [p_withdraw_id, id_account, p_wit_money, wit_date]
                            );
    
                            await connection.execute(
                                'UPDATE `saving-app`.`balance` SET principal = 0, interest = 0 WHERE acc_id = ?;',
                                [id_account]
                            );
    
                            await connection.execute(
                                'UPDATE `saving-app`.`account` SET close_date = ? WHERE acc_id = ?;',
                                [wit_date, id_account]
                            );
                        } else {
                            throw new Error('Error: Insufficient funds or time');
                        }
                    }
                } else {
                    throw new Error('Invalid withdrawal date');
                }
            } else {
                throw new Error('Account does not exist');
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
