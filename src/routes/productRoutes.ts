import { Router, Request, Response, NextFunction } from 'express';
import * as productController from '$controllers/rest/productController';
import { authenticate, authorize } from '$middlewares/auth';

const router = Router();

// Middleware to skip authentication for GET requests
const skipAuthForGet = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET') {
    return next();
  }
  return authenticate(req, res, next);
};

// Apply authentication middleware to all routes except GET
router.use(skipAuthForGet);

// Only ADMIN can create, update, delete products
router.post('/', authorize(['ADMIN']), productController.createProduct);
router.put('/:id', authorize(['ADMIN']), productController.updateProduct);
router.delete('/:id', authorize(['ADMIN']), productController.deleteProduct);

// Public GET endpoints
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

export default router;