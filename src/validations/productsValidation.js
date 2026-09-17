import { Segments, Joi } from 'celebrate';
import { CATEGORIES } from '../constants/categories.js';
import { isValidObjectId } from 'mongoose';

export const getAllProductsSchema = {
  [Segments.BODY]: Joi.object({
    category: Joi.string().valid(...CATEGORIES),
    search: Joi.string().trim().allow(''),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};

const objectIdValidator = (value, helpers) => {
  return isValidObjectId(value) ? value : helpers.message('Invalid id format');
};

export const productIdSchema = {
  [Segments.PARAMS]: Joi.object({
    productId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const createProductSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().required(),
    category: Joi.string()
      .valid(...CATEGORIES)
      .default('other'),
    description: Joi.string().allow(''),
  }),
};

export const updateProductSchema = {
  ...productIdSchema,
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3),
    price: Joi.number(),
    category: Joi.string().valid(...CATEGORIES),
    description: Joi.string().allow(''),
  }).min(1),
};
