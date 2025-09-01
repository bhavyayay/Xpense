"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionValidation = exports.goalValidation = exports.loginValidation = exports.registerValidation = exports.validateRequest = void 0;
// backend/src/utils/validators.ts
const { body, validationResult } = require('express-validator');
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errors.array()
        });
    }
    next();
};
exports.validateRequest = validateRequest;
exports.registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters')
];
exports.loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];
exports.goalValidation = [
    body('title')
        .notEmpty()
        .withMessage('Goal title is required')
        .isLength({ max: 100 })
        .withMessage('Title must be less than 100 characters'),
    body('targetAmount')
        .isNumeric()
        .withMessage('Target amount must be a number')
        .isFloat({ min: 1 })
        .withMessage('Target amount must be greater than 0'),
    body('deadline')
        .isISO8601()
        .withMessage('Please provide a valid date')
        .custom((value) => {
        if (new Date(value) <= new Date()) {
            throw new Error('Deadline must be in the future');
        }
        return true;
    }),
    body('category')
        .isIn(['saving', 'spending_limit', 'investment', 'debt_payoff'])
        .withMessage('Invalid goal category')
];
exports.transactionValidation = [
    body('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    body('category')
        .notEmpty()
        .withMessage('Category is required'),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 200 })
        .withMessage('Description must be less than 200 characters'),
    body('type')
        .isIn(['income', 'expense', 'saving', 'investment'])
        .withMessage('Invalid transaction type'),
    body('paymentMethod')
        .isIn(['cash', 'card', 'upi', 'bank_transfer', 'other'])
        .withMessage('Invalid payment method')
];
//# sourceMappingURL=validators.js.map