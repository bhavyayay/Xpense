"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaginatedResponse = exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors) => {
    res.status(statusCode).json({
        success: false,
        message,
        errors,
        timestamp: new Date().toISOString()
    });
};
exports.sendError = sendError;
const sendPaginatedResponse = (res, data, total, page, limit, message = 'Success') => {
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        },
        timestamp: new Date().toISOString()
    });
};
exports.sendPaginatedResponse = sendPaginatedResponse;
//# sourceMappingURL=responseHelper.js.map