import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';

export const paymentController = {
  async createPayment(req: Request, res: Response) {
    try {
      const { amount, description, idempotencyKey } = req.body;

      const result = await paymentService.createPayment({
        amount,
        description,
        idempotencyKey
      });

      if (result.isExisting) {
        return res.status(409).json({
          message: 'Payment already exists',
          payment: result.payment
        });
      }

      return res.status(201).json({
        message: 'Payment created successfully',
        payment: result.payment
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      return res.status(500).json({
        error: 'Failed to create payment'
      });
    }
  },

  async getAllPayments(req: Request, res: Response) {
    try {
      const payments = await paymentService.getAllPayments();
      return res.json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      return res.status(500).json({
        error: 'Failed to fetch payments'
      });
    }
  },

  async getPaymentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await paymentService.getPaymentById(id);
      
      if (!payment) {
        return res.status(404).json({
          error: 'Payment not found'
        });
      }

      return res.json(payment);
    } catch (error) {
      console.error('Error fetching payment:', error);
      return res.status(500).json({
        error: 'Failed to fetch payment'
      });
    }
  }
};
