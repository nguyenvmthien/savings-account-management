const pool = require('../../config/db');

class Accounts {
    async create({id_card, customer, customer_address, id_account, date_created, type_of_saving, interest_rate, money}) {
        try {
            // Insert a new account into the database
            // Insert a new customer into the database if customer doesn't exist
            // Update or Insert into balance table
        }
        catch (err) {
            console.error('Error creating account:', err);
            throw err;
        }
    }

    async edit({id_card, customer, customer_address, id_account, date_created, type_of_saving, interest_rate, money}) {
        try {
            // Update the account or customer in the database
        }
        catch (err) {
            console.error('Error editing account:', err);
            throw err;
        }
    }

    async searchAccount(id_account) {
        try {
            // Search for an account by id_account.
            // Return info account, customer
        }
        catch (err) {
            console.error('Error searching account:', err);
            throw err;
        }
    }

    async getTotalOpenedAccount() {
        try {
            // Get total opened account
        }
        catch (err) {
            console.error('Error getting total opened account:', err);
            throw err;
        }
    }

    async getBiggestIDAccount() {
        try {
            // get biggest id_account
        }
        catch (err) {
            console.error('Error getting biggest id_account:', err);
            throw err;
        }   
    }

    async getCurrentBalance(id_account) {
        try {
            // Get current balance of account
        }
        catch (err) {
            console.error('Error getting current balance:', err);
            throw err;
        }
    }

    async getLatestAccounts(numOfAccounts) {
        try {
            // Get latest accounts
        }
        catch (err) {
            console.error('Error getting latest accounts:', err);
            throw err;
        }
    }   
}

module.exports = new Accounts();