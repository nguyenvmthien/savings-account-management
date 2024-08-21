const pool = require('../config/db');

class Regulation_H {
    async create({
        type,
        applied_date,
        applied_time,
        interest_rate,
        min_dep_money,
        min_days_withdraw,
    }) {
        try {
            console.log(`type: ${type}`);
            console.log(`applied_date: ${applied_date}`);
            console.log(`applied_time: ${applied_time}`);
            console.log(`interest_rate: ${interest_rate}`);
            console.log(`min_dep_money: ${min_dep_money}`);
            console.log(`min_days_withdraw: ${min_days_withdraw}`);

            //Hello,  this is the concerning factor in the file
            const real_apply_date = `${applied_date} ${applied_time}`;
            // check check

            const connection = await pool.getConnection();
            await connection.beginTransaction();
            try {
                // Check if the account already exists
                const [existingRegulation] = await connection.execute(
                    'SELECT * FROM regulation WHERE type = ? and apply_date = ? and deleted = 0;',
                    [type, real_apply_date],

                );
                console.log(existingRegulation);
                //If regulation doesn't exist
                if (existingRegulation.length === 0) {
                    const deleted = 0;
                    await connection.execute(
                        'INSERT INTO regulation (type, apply_date, interest_rate, min_dep_money, min_wit_time, deleted) VALUES (?, ?, ?, ?, ?, ?);',
                        [
                            type,
                            real_apply_date,
                            interest_rate,
                            min_dep_money,
                            min_days_withdraw,
                            0,
                        ],
                    );

                    await connection.commit();
                }
                
                await connection.commit();
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

    async delete({ type, applied_date, applied_time }) {
        //We need apply_date & apply time for the primary key

        try {
            // delete in regulation table

            //Hello,  this is the concerning factor in the file
            const real_apply_date = `${applied_date} ${applied_time}`;
            // check check

            const connection = await pool.getConnection();
            await connection.beginTransaction();

            try {
                // Check if the regulation already exists
                const [existingRegulation] = await connection.execute(
                    'SELECT * FROM regulation WHERE type = ? and apply_date = ? and deleted = 0;',
                    [type, real_applied_date],
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
        applied_date,
        applied_time,
        interest_rate,
        min_dep_money,
        min_days_withdraw,
    }) {
        try {
            // create new regulation with delete = 0 and type not exist in table
            // update old regulation with delete = 1

            //Hello,  this is the concerning factor in the file
            const real_applied_date = `${applied_date} ${applied_time}`;
            // check check
            const connection = await pool.getConnection();
            await connection.beginTransaction();

            try {
                // Check if the regulation already exists
                const [existingRegulation] = await connection.execute(
                    'SELECT * FROM regulation WHERE type = ? and deleted = ?;',
                    [type, 0],
                );

                console.log(existingRegulation);

                //if regulation exists
                if (existingRegulation.length > 0) {
                    //delete regulation
                    const deleted = 1;       
                    await connection.execute(
                        'UPDATE regulation SET deleted = ? WHERE type = ?;',
                        [1, type],
                    );
                    console.log('Deleted regulation');

                    //create regulation
                    await connection.execute(
                        'INSERT INTO regulation (type, apply_date, interest_rate, min_dep_money, min_wit_time, deleted) VALUES (?, ?, ?, ?, ?, ?);',
                        [
                            type,
                            real_applied_date,
                            interest_rate,
                            min_dep_money,
                            min_days_withdraw,
                            0,
                        ],
                    );
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
                    type,
                    apply_date,
                    interest_rate
                FROM regulation
                WHERE deleted = 0;
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
    
    async getMinDepMoneyAndMinWitDays({ type, apply_date }) {
        console.log(type + apply_date);
        try {
            //Hello,  this is the concerning factor in the file
            // check check
            //SQL query to get min_dep_money & min_wit_days
            const query = `
            SELECT 
                min_dep_money,
                min_wit_time
            FROM regulation
            WHERE type = ? and apply_date = ? and deleted = 0;
            `;

            const [rows, fields] = await pool.execute(query, [
                type,
                apply_date,
            ]);
            console.log(rows);
            if (rows.length > 0) {
                return rows[0];
            } else {
                throw new Error('There is nothing here.');
            }
        } catch (err) {
            console.error(
                'Error getting min_dep_money and min_days_withdraw:',
                err,
            );
            throw err;
        }
    }
}

module.exports = new Regulation_H();
