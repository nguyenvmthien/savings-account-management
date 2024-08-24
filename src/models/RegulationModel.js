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
                    'SELECT * FROM regulation WHERE type = ? and deleted = 0;',
                    [type],
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
                    return { message: 'success' };
                }

                await connection.commit();
                return { message: 'fail' };
            } catch (err) {
                //errors appear during creating
                await connection.rollback();
                return { message: 'fail' };
                console.error('Error during creating regulation:', err);
                throw err;
            } finally {
                //final step
                connection.release();
            }
            //error
        } catch (err) {
            return { message: 'fail' };
            console.log('Erorr regulation: ', err);
            throw err;
        }
    }

    async delete({ type }) {
        //We need apply_date & apply time for the primary key

        try {
            // delete in regulation table

            //Hello,  this is the concerning factor in the file
            // const real_applied_date = `${applied_date} ${applied_time}`;

            // check check

            const connection = await pool.getConnection();
            await connection.beginTransaction();

            try {
                // Check if the regulation already exists
                const [existingRegulation] = await connection.execute(
                    'SELECT * FROM regulation WHERE type = ? and deleted = 0;',
                    [type],
                );

                //if regulation exists
                if (existingRegulation.length > 0) {
                    //delete regulation
                    const deleted = 1;
                    await connection.execute(
                        'UPDATE regulation SET deleted = ? WHERE type = ?',
                        [deleted, type],
                    );

                    await connection.commit();
                    return { message: 'success' };
                } else {
                    return { message: 'fail' };
                    throw new Error('There is nothing here.');
                }
            } catch (err) {
                //throw error if there is error during the deleting process
                await connection.rollback();
                return { message: 'fail' };
                console.error('Erorr during deleting:', err);
                throw err;
            } finally {
                //final step
                connection.release();
            }
        } catch {
            //throw error
            return { message: 'fail' };
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
            console.log('Type:', type);
            console.log('Real Applied Date:', real_applied_date);
            console.log('Interest Rate:', interest_rate);
            console.log('Min Deposit Money:', min_dep_money);
            console.log('Min Days Withdraw:', min_days_withdraw);

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
                    // this.delete(existingRegulation[0]);
                    await connection.commit();
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
                    // this.create([type, real_applied_date, interest_rate, min_dep_money, min_days_withdraw]);
                    await connection.commit();
                }
                return { message: 'success' };
            } catch (err) {
                //throw error
                await connection.rollback();
                return { message: 'fail' };
                console.error('Error during editing:', err);
                throw err;
            } finally {
                //final step
                connection.release();
            }
        } catch (err) {
            return { message: 'fail' };
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
            rows.sort((a, b) => {
                // Handle the special case for "non-term"
                if (a.type === 'Non-term') return -1;
                if (b.type === 'Non-term') return 1;

                // Extract the numeric part of the term (e.g., "1 month" -> 1, "2 months" -> 2)
                const aMonths = parseInt(a.type.match(/\d+/), 10);
                const bMonths = parseInt(b.type.match(/\d+/), 10);

                // If both terms have numbers, compare them numerically
                if (!isNaN(aMonths) && !isNaN(bMonths)) {
                    return aMonths - bMonths;
                }

                // If one of the terms couldn't be parsed, keep the original order
                return 0;
            });

            if (rows.length > 0) {
                // Return all rows (each row represents a type of saving)
                return rows;
            } else {
                return { message: 'fail' };
                throw new Error('There is nothing here.');
            }
        } catch (err) {
            return { message: 'fail' };
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
                    type AS type,
                    CONVERT_TZ(apply_date, '+00:00', @@session.time_zone) AS apply_date,
                    interest_rate AS interest_rate
                FROM regulation;
            `;

            //Execute the query and get the rows (ignore fields)
            const [rows, fields] = await pool.execute(query);

            if (rows.length > 0) {
                // Return all rows (each row represents a type of saving)
                return rows;
            } else {
                return { message: 'fail' };
                throw new Error('There is nothing here.');
            }
        } catch (err) {
            return { message: 'fail' };
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
                return { message: 'fail' };
                throw new Error('There is nothing here.');
            }
        } catch (err) {
            return { message: 'fail' };
            console.error(
                'Error getting min_dep_money and min_days_withdraw:',
                err,
            );
            throw err;
        }
    }
}

module.exports = new Regulation_H();
