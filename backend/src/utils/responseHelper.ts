// backend/src/utils/responseHelper.ts
import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message: string = 'Success', statusCode: number = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const sendError = (res: Response, message: string = 'Internal Server Error', statusCode: number = 500, errors?: any) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

export const sendPaginatedResponse = (res: Response, data: any[], total: number, page: number, limit: number, message: string = 'Success') => {
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
