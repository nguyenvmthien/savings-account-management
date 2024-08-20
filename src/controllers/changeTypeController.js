const regulationModel = require('../models/RegulationModel');
class Regulation_Controller {
    async renderChangeTypeCreate(req, res) {
        res.render('change_type_create');
    }

    renderChangeTypeEdit(req, res) {
        res.render('change_type_edit');
    }

    renderChangeTypeDelete(req, res) {
        res.render('change_type_delete');
    }

    renderChangeType(req, res) {
        res.render('change_type');
    }

    async create(req, res) {
        const {
            type,
            applied_date,
            applied_time,
            interest_rate,
            min_dep_money,
            min_days_withdraw,
        } = req.body;
        console.log(req.body);
        try {
            await regulationModel.create({
                type,
                applied_date,
                applied_time,
                interest_rate,
                min_dep_money,
                min_days_withdraw,
            });
            res.render('change_type_create');
        } catch {
            // console.error('Error creating regulation:', err);
            throw err;
        }
    }

    async edit(req, res) {
        const {
            type,
            applied_date,
            applied_time,
            interest_rate,
            min_des_money,
            min_days_withdraw,
        } = req.body;

        try {
            await regulationModel.edit({
                type,
                applied_date,
                applied_time,
                interest_rate,
                min_des_money,
                min_days_withdraw,
            });
            res.render('change_type_edit', { message: 'success' });
        } catch {
            console.error('Error editing regulation:', err);
            throw err;
        }
    }

    async delete(req, res) {
        const { type, applied_date, applied_time } = req.body;
        try {
            await regulationModel.delete({ type, applied_date, applied_time });
            res.render('change_type_delete', { message: 'success' });
        } catch {
            console.error('Error deleting regulation:', err);
            throw err;
        }
    }
}

module.exports = new Regulation_Controller();
