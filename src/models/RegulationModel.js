const pool = require('../config/db');

class Regulation_H {
    async create({
        type,
        apply_date,
        apply_time,
        interest_rate,
        min_des_money,
        min_days_withdraw,
    }) {
        try {
            //Hello,  this is the concerning factor in the file
            const real_apply_date = `${apply_date} ${apply_time}`;
            // check check

            const connection = await pool.getConnection();
            await connection.beginTransaction();
            try {
                // Check if the account already exists
                const [existingRegulation] = await connection.execute(
                    'SELECT * FROM account WHERE type = ? and apply_time = ? and deleted = 0;',
                    [type, real_apply_date],
                );
                //If regulation doesn't exist
                if (existingRegulation.length === 0) {
                    const deleted = 0;
                    await connection.execute(
                        'INSERT INTO deposit (type, apply_date, interest_rate, min_des_money, min_wit_time, deleted) VALUES (?, ?, ?, ?, ?, ?);',
                        [
                            type,
                            real_apply_date,
                            interest_rate,
                            min_des_money,
                            min_days_withdraw,
                            0,
                        ],
                    );

                    await connection.commit();
                }
            } catch (err) {
                //errors appear during creating
                await connection.rollback();
                console.error('Error during creating regulation:', err);
                throw err;
            } finally {
                //final step
                connection.release();
            }
            //error
        } catch (err) {
            console.log('Erorr regulation: ', err);
            throw err;
        }
    }

    async delete({ type, apply_date, apply_time }) {
        //We need apply_date & apply time for the primary key

        try {
            // delete in regulation table

            //Hello,  this is the concerning factor in the file
            const real_apply_date = `${apply_date} ${apply_time}`;
            // check check

            const connection = await pool.getConnection();
            await connection.beginTransaction();

            try {
                // Check if the regulation already exists
                const [existingRegulation] = await connection.execute(
                    'SELECT * FROM account WHERE type = ? and apply_time = ? and deleted = 0;',
                    [type, real_apply_date],
                );

                //if regulation exists
                if (existingRegulation.length > 0) {
                    //delete regulation
                    const deleted = 1;
                    await connection.execute(
                        'UPDATE regulation SET deleted = ? WHERE type = ? AND apply_date = ?;',
                        [deleted, type, real_apply_date],
                    );

                    await connection.commit();
                }
            } catch (err) {
                //throw error if there is error during the deleting process
                await connection.rollback();
                console.error('Erorr during deleting:', err);
                throw err;
            } finally {
                //final step
                connection.release();
            }
        } catch {
            //throw error
            console.error('Error delete regulation:', err);
            throw err;
        }
    }

    async edit({
        type,
        apply_date,
        apply_time,
        interest_rate,
        min_des_money,
        min_days_withdraw,
    }) {
        try {
            // create new regulation with delete = 0 and type not exist in table
            // update old regulation with delete = 1

            //Hello,  this is the concerning factor in the file
            const real_apply_date = `${apply_date} ${apply_time}`;
            // check check

            const connection = await pool.getConnection();
            await connection.beginTransaction();

            try {
                // Check if the regulation already exists
                const [existingRegulation] = await connection.execute(
                    'SELECT * FROM account WHERE type = ? and apply_time = ? and deleted = 0;',
                    [type, real_apply_date],
                );

                //if regulation exists
                if (existingRegulation.length > 0) {
                    //delete regulation
                    this.delete({ type, apply_date, apply_time });

                    //create regulation
                    this.create({
                        type,
                        apply_date,
                        interest_rate,
                        min_des_money,
                        min_days_withdraw,
                    });

                    await connection.commit();
                }
            } catch (err) {
                //throw error
                await connection.rollback();
                console.error('Error during editing:', err);
                throw err;
            } finally {
                //final step
                connection.release();
            }
        } catch (err) {
            console.error('Error edit regulation:', err);
            throw err;
        }
    }

    async getCurrentTypeOfSaving() {
        try {
            // get CURRENT type of saving
            // return type, apply_date, interest_rate

            // SQL query to get all current types of savings
            const query = `
                SELECT
                    type AS type_of_regulation,
                    apply_date AS apply_date_of_regulation,
                    interest_rate AS interest_rate_of_regulation
                FROM regulation
                WHERE deleted > 0;
            `;

            //Execute the query and get the rows (ignore fields)
            const [rows, fields] = await pool.execute(query);

            if (rows.length > 0) {
                // Return all rows (each row represents a type of saving)
                return rows;
            } else {
                throw new Error('There is nothing here.');
            }
        } catch (err) {
            console.error('Error getting current type of saving:', err);
            throw err;
        }
    }

    async getAllTypeOfSaving() {
        try {
            // get all type of saving
            // return type, apply_date, interest_rate

            // SQL query to get all types of savings
            const query = `
                SELECT
                    type AS type_of_regulation,
                    apply_date AS apply_date_of_regulation,
                    interest_rate AS interest_rate_of_regulation
                FROM regulation;
            `;

            //Execute the query and get the rows (ignore fields)
            const [rows, fields] = await pool.execute(query);

            if (rows.length > 0) {
                // Return all rows (each row represents a type of saving)
                return rows;
            } else {
                throw new Error('There is nothing here.');
            }
        } catch (err) {
            console.error('Error getting all type of saving:', err);
            throw err;
        }
    }
    async getMinDepMoneyAndMinWitDays({ type, apply_date, apply_time }) {
        try {
            //Hello,  this is the concerning factor in the file
            const real_apply_date = `${apply_date} ${apply_time}`;
            // check check
            //SQL query to get min_dep_money & min_wit_days
            const query = `
            SELECT 
                min_des_money AS minimum_amount_to_deposit,
                min_wit_time AS mimium_days_to_witdraw
            FROM regulation
            WHERE type = ? and apply_time = ? and deleted = 0;
            `;

            const [rows, fields] = await pool.execute(query, [
                type,
                real_apply_date,
            ]);

            if (rows.length > 0) {
                // Access the first row and the all_deposit_transaction column
                return rows[0].all_deposit_transation;
            } else {
                throw new Error('There is nothing here.');
            }
        } catch (err) {
            console.error(
                'Error getting min_des_money and min_days_withdraw:',
                err,
            );
            throw err;
        }
    }
}

module.exports = new Regulation_H();