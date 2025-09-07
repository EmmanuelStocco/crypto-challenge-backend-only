import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { validatePayment } from '../middleware/validatePayment';

const router = Router();

router.post('/', validatePayment, paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);

export { router as paymentRoutes };
