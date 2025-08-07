import { Router } from 'express';
import * as authController from '../controllers/rest/authController';

const router = Router();

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

export default router;
