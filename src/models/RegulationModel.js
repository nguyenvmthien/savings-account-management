const pool = require('../../config/db');

class Regulation_H {
    async create({
        type,
        applied_date,
        applied_time,
        interest_rate,
        min_des_money,
        min_days_withdraw,
    }) {
        try {
            // create in regulation table, delete = 0 and type not exist in table
        } catch {
            console.error('Error create regulation:', err);
            throw err;
        }
    }
    async edit({
        type,
        applied_date,
        applied_time,
        interest_rate,
        min_des_money,
        min_days_withdraw,
    }) {
        try {
            // create new regulation with delete = 0 and type not exist in table
            // update old regulation with delete = 1
        } catch {
            console.error('Error edit regulation:', err);
            throw err;
        }
    }

    async delete({ type }) {
        try {
            // delete in regulation table
        } catch {
            console.error('Error delete regulation:', err);
            throw err;
        }
    }

    async getCurrentTypeOfSaving() {
        try {
            // get CURRENT type of saving
            // return type, applied_date, interest_rate
        } catch (err) {
            console.error('Error getting current type of saving:', err);
            throw err;
        }
    }

    async getAllTypeOfSaving() {
        try {
            // get all type of saving
            // return type, applied_date, interest_rate
        } catch (err) {
            console.error('Error getting all type of saving:', err);
            throw err;
        }
    }
    async getMinDesMoneyAndMinWithDays({ type, applied_date, applied_time }) {
        try {
            // get min_des_money and min_days_withdraw
        } catch (err) {
            console.error(
                'Error getting min_des_money and min_days_withdraw:',
                err,
            );
            throw err;
        }
    }
}
