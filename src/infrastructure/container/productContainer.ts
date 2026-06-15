import { CreateProduct } from '@/application/use-cases/products/CreateProduct';
import { GetProducts } from '@/application/use-cases/products/GetProducts';
import { UpdateProduct } from '@/application/use-cases/products/UpdateProduct';
import { LocalStorageProductRepository } from '@/infrastructure/repositories/LocalStorageProductRepository';

const productRepository = new LocalStorageProductRepository();

export const productUseCases = {
  getProducts: new GetProducts(productRepository),
  createProduct: new CreateProduct(productRepository),
  updateProduct: new UpdateProduct(productRepository),
};
