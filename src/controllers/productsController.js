import { Product } from '../models/product.js';
import createHttpError from 'http-errors';

export async function getAllProducts(request, response) {
  const products = await Product.find({ userId: request.user._id });
  response.status(200).json(products);
}

export async function getProductById(request, response) {
  const { productId } = request.params;
  const product = await Product.findOne({_id: productId, userId: request.user._id});

  if (product === null) {
    throw createHttpError(404, 'Product not found');
  }

  response.status(200).json(product);
}

export async function createProduct(request, response) {
  const product = await Product.create({...request.body, userId: request.user._id});
  response.status(201).json(product);
}

export async function updateProduct(request, response) {
  const { productId } = request.params;
  const product = await Product.findOneAndUpdate(
    { _id: productId, userId: request.user._id },
    request.body,
    {
      returnDocument: 'after',
    },
  );

  if (product === null) {
    throw createHttpError(404, 'Product not found');
  }

  response.status(200).json(product);
}

export async function deleteProduct(request, response) {
  const { productId } = request.params;
  const product = await Product.findOneAndDelete({ _id: productId,  userId: request.user._id });

  if (product === null) {
    throw createHttpError(404, 'Product not found');
  }

  response.status(200).json(product);
}
