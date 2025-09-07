import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreatePaymentData {
  amount: number;
  description: string;
  idempotencyKey: string;
}

interface PaymentResult {
  payment: any;
  isExisting: boolean;
}

export const paymentService = {
  async createPayment(data: CreatePaymentData): Promise<PaymentResult> {
    const { amount, description, idempotencyKey } = data;

    // Check if payment with this idempotency key already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { idempotencyKey }
    });

    if (existingPayment) {
      return {
        payment: existingPayment,
        isExisting: true
      };
    }

    // Create new payment
    const newPayment = await prisma.payment.create({
      data: {
        amount,
        description,
        idempotencyKey,
        status: 'completed'
      }
    });

    return {
      payment: newPayment,
      isExisting: false
    };
  },

  async getPaymentById(id: string) {
    return await prisma.payment.findUnique({
      where: { id }
    });
  },

  async getAllPayments() {
    return await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
};
