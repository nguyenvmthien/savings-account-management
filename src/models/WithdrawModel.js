const pool = require('../../config/db');

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
            // Insert a new withdraw into the database
            // Update into balance table
             // Return the withdraw information
             // update close_date in account table if balance < 1

            // Check if the account exists
            const [existingAccount] = await connection.execute(
                'SELECT COUNT(*) as acc_exists FROM `saving-app`.`account` WHERE acc_id = ?;',
                [id_account]
            );
    
            if (existingAccount[0].acc_exists > 0) {
                // Retrieve account details
                const [accountDetails] = await connection.execute(
                    `SELECT a.open_date, r.min_wit_time, r.interest_rate, a.type 
                     FROM account a 
                     JOIN regulation r ON a.type = r.type 
                     WHERE a.acc_id = ?;`,
                    [id_account]
                );
    
                const p_opened_date = accountDetails[0].open_date;
                // const p_min_wit_time = accountDetails[0].min_wit_time;
                const p_interest_rate = accountDetails[0].interest_rate;
                const p_type = accountDetails[0].type;
    
                const [balanceDetails] = await connection.execute(
                    'SELECT principal, interest FROM balance WHERE acc_id = ?;',
                    [id_account]
                );
    
                let p_principal = balanceDetails[0].principal;
                let p_interest = balanceDetails[0].interest;
    
                const time_difference = Math.floor(
                    (new Date(wit_date) - new Date(p_opened_date)) / (1000 * 60 * 60 * 24)
                );
    
                if (new Date(wit_date) > new Date(p_opened_date)) {
                    if (p_type === 'Non-term') {
                        if (wit_money <= (p_principal + p_interest)) {
                            const p_withdraw_id = `WIT${Math.floor(Math.random() * 100000)
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
    
                            if (Math.floor(p_principal) === 0) {
                                await connection.execute(
                                    'UPDATE `saving-app`.`account` SET close_date = ? WHERE acc_id = ?;',
                                    [wit_date, id_account]
                                );
                            }
                        } else {
                            throw new Error('Error: Insufficient funds');
                        }
                    } else if (p_type === '3 months' && time_difference >= 90 && wit_money <= (p_principal + p_interest)) {
                        const number_of_maturities = Math.floor(time_difference / 90);
                        p_interest = p_principal * number_of_maturities * p_interest_rate;
    
                        await connection.execute(
                            'UPDATE `saving-app`.`balance` SET interest = ? WHERE acc_id = ?;',
                            [p_interest, id_account]
                        );
    
                        const p_withdraw_id = `WIT${Math.floor(Math.random() * 100000)
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
                    } else if (p_type === '6 months' && time_difference >= 180 && wit_money <= (p_principal + p_interest)) {
                        const number_of_maturities = Math.floor(time_difference / 180);
                        p_interest = p_principal * number_of_maturities * p_interest_rate;
    
                        await connection.execute(
                            'UPDATE `saving-app`.`balance` SET interest = ? WHERE acc_id = ?;',
                            [p_interest, id_account]
                        );
    
                        const p_withdraw_id = `WIT${Math.floor(Math.random() * 100000)
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
                } else {
                    throw new Error('Invalid withdrawal date');
                }
            } else {
                throw new Error('Account does not exist');
            }
    
            // // Return the withdrawal record
            // const [withdrawal] = await connection.execute(
            //     'SELECT * FROM `saving-app`.`withdraw` WHERE wit_id = ?;',
            //     [p_withdraw_id]
            // );
    
            await connection.commit();
            // return withdrawal;
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
        } catch (err) {
            console.error('Error getting all withdraw money:', err);
            throw err;
        }
    }
}
