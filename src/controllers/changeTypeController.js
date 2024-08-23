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
        console.log(req);
        const {
            type,
            applied_date,
            applied_time,
            interest_rate,
            min_dep_money,
            min_days_withdraw,
        } = req.body;
        try {
            await regulationModel.create({
                type,
                applied_date,
                applied_time,
                interest_rate,
                min_dep_money,
                min_days_withdraw,
            });
            res.json({message:'success'});
        } catch (err) {
            console.error('Error creating regulation:', err);
            res.json({message:'fail'});
        }
    }

    async edit(req, res) {
        const {
            type,
            applied_date,
            applied_time,
            interest_rate,
            min_dep_money,
            min_days_withdraw,
        } = req.body;
        try {
            await regulationModel.edit({
                type,
                applied_date,
                applied_time,
                interest_rate,
                min_dep_money,
                min_days_withdraw,
            });
            res.json({ message: 'success' });
        } catch {
            console.error('Error editing regulation:', err);
            res.json({message:'fail'});
        }
    }

    async delete(req, res) {
        const { type, applied_date, applied_time } = req.body;
        try {
            await regulationModel.delete({ type, applied_date, applied_time });
            res.json({ message: 'success' });
        } catch {
            console.error('Error deleting regulation:', err);
            res.json({message:'fail'});
        }
    }
}

module.exports = new Regulation_Controller();
