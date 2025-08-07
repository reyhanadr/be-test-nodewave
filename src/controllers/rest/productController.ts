import { Request, Response } from 'express';
import { 
  CreateProductInput, 
  ProductResponse,
  ProductListResponse
} from '../../entities/Product';
import { FilteringQueryV2 } from '../../entities/Query';

import { 
  createProduct as createProductService,
  getProductById as getProductByIdService,
  getAllProducts as getAllProductsService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService
} from '../../services/productService';

/**
 * Controller to handle product creation.
 * Sends HTTP 201 on success, 500 on failure.
 */
export const createProduct = async (
  req: Request<{}, {}, CreateProductInput>,
  res: Response<ProductResponse>
) => {
  try {
    const product = await createProductService(req.body);
    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating product',
    });
  }
};

/**
 * Controller to retrieve a single product by ID.
 * Sends HTTP 200 if found, 404 if not found, 500 on error.
 */
export const getProduct = async (
  req: Request<{ id: string }>,
  res: Response<ProductResponse>
) => {
  try {
    const id = parseInt(req.params.id);
    const product = await getProductByIdService(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving product',
    });
  }
};

/**
 * Controller to retrieve a paginated list of products.
 * Supports filtering, search, sorting, and range queries.
 */
export const getProducts = async (
  req: Request<{}, {}, {}, FilteringQueryV2>,
  res: Response<ProductListResponse>
) => {
  try {
    // Parse query params into FilteringQueryV2 structure
    const filter: FilteringQueryV2 = {
      page: req.query.page ? Number(req.query.page) : undefined,
      rows: req.query.rows ? Number(req.query.rows) : undefined,
      orderKey: req.query.orderKey as string | undefined,
      orderRule: req.query.orderRule as string | undefined,
      filters: req.query.filters 
        ? JSON.parse(req.query.filters as unknown as string) 
        : undefined,
      searchFilters: req.query.searchFilters 
        ? JSON.parse(req.query.searchFilters as unknown as string) 
        : undefined,
      rangedFilters: req.query.rangedFilters 
        ? Array.isArray(JSON.parse(req.query.rangedFilters as unknown as string)) 
          ? JSON.parse(req.query.rangedFilters as unknown as string) 
          : [JSON.parse(req.query.rangedFilters as unknown as string)] 
        : undefined,
    };

    const result = await getAllProductsService(filter);

    return res.status(200).json({
      success: true,
      data: result.entries,
      total: result.totalData,
      totalPage: result.totalPage,
    });
  } catch (error: any) {
    // Return empty result on error
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving products',
      data: [],
      total: 0,
      totalPage: 0,
    });
  }
};

/**
 * Controller to update a product by ID.
 * Sends HTTP 200 on success, 404 if product not found.
 */
export const updateProduct = async (
  req: Request<{ id: string }, {}, CreateProductInput>,
  res: Response<ProductResponse>
) => {
  try {
    const id = parseInt(req.params.id);
    const product = await updateProductService(id, req.body);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating product',
    });
  }
};

/**
 * Controller to delete a product by ID.
 * Sends HTTP 200 on success, 500 on error.
 */
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response<ProductResponse>
) => {
  try {
    const id = parseInt(req.params.id);
    await deleteProductService(id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting product',
    });
  }
};
