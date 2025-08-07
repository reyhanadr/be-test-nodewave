import { PrismaClient, Product, Prisma } from '@prisma/client';
import { CreateProductInput, UpdateProductInput } from '../entities/Product';
import { PagedList, FilteringQueryV2 } from '$entities/Query';
import { buildWhereQuery, buildSearchQuery, buildRangedFilter } from './helpers/FilterQueryV2';

const prisma = new PrismaClient();

export const createProduct = async (data: CreateProductInput): Promise<Product> => {
  return await prisma.product.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
};

export const getProductById = async (id: number): Promise<Product | null> => {
  return await prisma.product.findUnique({
    where: { id },
  });
};

export const getAllProducts = async (filter: FilteringQueryV2 = { page: 1, rows: 10 }): Promise<PagedList<Product[]>> => {
  const skip = ((filter.page || 1) - 1) * (filter.rows || 10);
  const whereClause = [];
  
  // Apply filters
  if (filter.filters) {
    whereClause.push(...buildWhereQuery(filter.filters));
  }
  
  // Apply search filters
  if (filter.searchFilters) {
    whereClause.push(...buildSearchQuery(filter.searchFilters));
  }
  
  // Apply ranged filters
  if (filter.rangedFilters) {
    whereClause.push(...buildRangedFilter(filter.rangedFilters));
  }

  const [total, entries] = await Promise.all([
    prisma.product.count({ where: whereClause.length > 0 ? { AND: whereClause } : undefined }),
    prisma.product.findMany({
      where: whereClause.length > 0 ? { AND: whereClause } : undefined,
      orderBy: filter.orderKey ? {
        [filter.orderKey]: filter.orderRule?.toLowerCase() as Prisma.SortOrder || 'asc',
      } : { createdAt: 'desc' },
      skip,
      take: filter.rows || 10,
    }),
  ]);

  return {
    entries,
    totalData: total,
    totalPage: Math.ceil(total / (filter.rows || 10)),
  };
};

export const updateProduct = async (
  id: number,
  data: UpdateProductInput
): Promise<Product> => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: number): Promise<Product> => {
  return await prisma.product.delete({
    where: { id },
  });
};
