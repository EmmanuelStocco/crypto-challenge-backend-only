import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().min(1).max(500).required()
});

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validatePayment = (req: Request, res: Response, next: NextFunction) => {
  req.body = req.body || {}; // garante que body existe

  const { error } = paymentSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }

  // Check for idempotency key in headers
  const idempotencyKey = req.headers['x-idempotency-key'] as string; 

  if (!idempotencyKey) {
    return res.status(400).json({
      error: 'X-Idempotency-Key header is required'
    });
  }

  // Validate idempotency key format (UUID)
  if (!uuidRegex.test(idempotencyKey)) {
    return res.status(400).json({
      error: 'X-Idempotency-Key must be a valid UUID',
      details: ['X-Idempotency-Key must match UUID format']
    });
  }

  req.body.idempotencyKey = idempotencyKey; // agora seguro
  next();
};
