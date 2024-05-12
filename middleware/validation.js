const { check, param, body, validationResult } = require('express-validator');

const addTrainValidationRules = () => {
    return [
        check('train_name').notEmpty().isString(),
        check('source').notEmpty().isString(),
        check('destination').notEmpty().isString(),
        check('total_seats').notEmpty().isInt({ min: 1 }),
    ];
};

const updateTrainSeatsValidationRules = () => {
    return [
        param('trainId').notEmpty().isInt(),
        body('add_seats').notEmpty().isInt({ min: 1 }),
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ errors: errors.array() });
};

module.exports = {
    addTrainValidationRules,
    updateTrainSeatsValidationRules,
    validate
};
