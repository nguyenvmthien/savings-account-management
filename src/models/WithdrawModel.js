const { types } = require('node-sass');
const pool = require('../config/db');
const account = require('./AccountModel.js');

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
            console.log('Begin withdraw'); 
            // const [[{ acc_exists }]] = await connection.execute(
            //     'SELECT COUNT(*) as acc_exists FROM account WHERE acc_id = ?;',
            //     [id_account],
            // );

            // if (!acc_exists) throw new Error('Account does not exist');

            const {totalUpdatedPrincipal, latestDeposit} = account.getCurrentBalance(id_account, withdraw_date);

            const [[accountDetails], [balanceDetails]] = await Promise.all([
                connection.execute(
                    'SELECT a.open_date, ' +
                        ' r.interest_rate, a.type ' +
                        'FROM account a ' +
                        'JOIN regulation r ON a.type = r.type ' +
                        'WHERE a.acc_id = ?;',
                    [id_account],
                ),
                connection.execute(
                    'SELECT principal, interest FROM balance WHERE acc_id = ?;',
                    [id_account],
                ),
            ]);
            

            const {
                open_date,
                interest_rate,
                type: account_type,
            } = accountDetails[0];

            const dateOpened = new Date(open_date);
            const witDate = new Date(withdraw_date);
            console.log('Account information: ', accountDetails[0]);

            console.log('Balance information: ', balanceDetails[0]);

            console.log('Open date: ',dateOpened);
            console.log('Interest rate: ',interest_rate);
            console.log('Account type: ' ,account_type);
            console.log('Withdraw money: ', money_withdraw);
            

            let { principal, interest } = balanceDetails[0];

            const [[latestwitID], [haveDeposited]] = await Promise.all([
                connection.execute(
                    `
                    SELECT wit_id
                    FROM withdraw
                    ORDER BY wit_id DESC
                    LIMIT 1;
                    `
                ),
                connection.execute(
                    `
                    SELECT dep_date
                    FROM deposit
                    ORDER BY dep_date DESC
                    LIMIT 1;
                    `
                ),
            ]);

            console.log('Latest wit_id: ', latestwitID[0].wit_id);

            const prefix = 'WIT';

            // Extract the numeric part of the wit_id by slicing after the prefix length
            const number = latestwitID[0].wit_id.slice(
                prefix.length,
            ); // Assuming the wit_id format is 'DEPXXXXX'

            // Increment the numeric part, convert it to a string, and pad with leading zeros to maintain length
            const next_number = (parseInt(number, 10) + 1)
                .toString()
                .padStart(number.length, '0');

            // Combine the prefix with the new numeric part to create the next dep_id
            const wit_id = prefix + next_number;

            console.log('Next wit_id:', wit_id);

            let time_difference = (witDate - dateOpened) / (1000 * 60 * 60 * 24);
        
            
            console.log('Withdraw date: ', witDate);
            console.log('Time difference: ', time_difference);

            // if (witDate <= dateOpened)
            //     throw new Error('Invalid withdrawal date');

            if (account_type === 'Non-term') {
                // if (money_withdraw > principal + interest)
                //     throw new Error('Error: Insufficient funds');

                
                if(haveDeposited.length > 0)
                    {
                        const dateDeposited = new Date(haveDeposited[0].dep_date);
                        time_difference = Math.floor(
                            (witDate - dateDeposited) /
                                (1000 * 60 * 60 * 24),
                        );
                        console.log('Date deposited:', dateDeposited);
                    }

                if (time_difference >= 30) {
                    interest = principal * interest_rate/100;
                    principal -= money_withdraw / (1 + interest_rate/100);
                    interest -=
                        (money_withdraw * interest_rate) / (1 + interest_rate/100);
                } else {
                    principal -= money_withdraw;
                }

                console.log('principal: ', principal);
                console.log('interest: '. interest);

                await connection.execute(
                    'UPDATE balance SET principal = ?, interest = ? WHERE acc_id = ?;',
                    [principal, interest, id_account],
                );

                if (Math.floor(principal + interest) === 0) {
                    await connection.execute(
                        'UPDATE account SET close_date = ? WHERE acc_id = ?;',
                        [withdraw_date, id_account],
                    );
                    console.log('Account closed');
                }
                console.log('Updated balance');

                await connection.execute(
                    'INSERT INTO withdraw (wit_id, acc_id, wit_money, wit_date) VALUES (?, ?, ?, ?);',
                    [wit_id, id_account, money_withdraw, withdraw_date],
                );

                console.log('Inserted into withdraw table');
                
                
            } else {
                const [[{ month_number }]] = await connection.execute(
                    'SELECT CAST(SUBSTRING_INDEX(?, " ", 1) AS UNSIGNED) AS month_number;',
                    [account_type],
                );
                console.log('month number: ', month_number);
                const limit_days = month_number * 30;

                const number_of_maturities = Math.floor(
                    time_difference / limit_days,
                );

                interest = principal * number_of_maturities * interest_rate/100;

                console.log('interest:', interest);
                console.log('principal:', principal);

                await connection.execute(
                    'UPDATE balance SET interest = ? WHERE acc_id = ?;',
                    [interest, id_account],
                );
                    
                await connection.execute(
                    'INSERT INTO withdraw (wit_id, acc_id, wit_money, wit_date) VALUES (?, ?, ?, ?);',
                    [wit_id, id_account, money_withdraw, withdraw_date],
                );

                console.log('Inserted into witdraw');

                await connection.execute(
                    'UPDATE balance SET principal = 0, interest = 0 WHERE acc_id = ?;',
                    [id_account],
                );

                console.log('Updated balance');

                await connection.execute(
                    'UPDATE account SET close_date = ? WHERE acc_id = ?;',
                    [withdraw_date, id_account],
                );

                console.log('Account closed');
                
            }

            await connection.commit();

            // print to debug
            console.log('commit successful');

            // add the deposit information to the response
            return { message: 'success' };

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

module.exports = new Withdraw_H();