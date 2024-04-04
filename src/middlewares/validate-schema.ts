import { failed } from '../config/response';
import { RequestHandler } from 'express';
import Joi from 'joi';

export const validateSchema = (
  schema: Joi.ObjectSchema<any>[],
  properties: 'body' = 'body'
): RequestHandler => async (req, res, next) => {
  if (!Array.isArray(schema)) {
    return failed(req, res, 'Schema supports array only');
  }

  const length = schema.length;
  for (let x = 0; x < length; x++) {
    const { error } = schema[x].validate(req[properties]);
    if (error) {
      return failed(req, res, error.details[0].message);
    }
  }

  next();
};
