import { Product } from '@prisma/client';

export interface CreateProductInput extends Omit<Product, 'id'> {}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface ProductResponse {
  success: boolean;
  data?: Product | Product[] | null;
  message?: string;
}

export interface ProductListResponse {
  success: boolean;
  data: Product[];
  total: number;
  totalPage: number;
  message?: string;
}