import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/config/repository/typeorm.repository';
import { DataSource } from 'typeorm';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentRepository extends TypeOrmRepository<Payment> {
  constructor(private readonly dataSource: DataSource) {
    super(Payment, dataSource.createEntityManager());
  }

  /**
   * Find payment by transaction reference
   */
  async findByTransactionReference(transactionReference: string): Promise<Payment | null> {
    return await this.findOne({
      where: { transactionReference },
      relations: ['user', 'paymentOption', 'transaction'],
    });
  }

  /**
   * Create a new payment record
   */
  async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    const payment = this.create(paymentData);
    return await this.save(payment);
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(id: string, status: any): Promise<void> {
    await this.update(id, { status });
  }

  /**
   * Find payments by user ID
   */
  async findByUserId(userId: string): Promise<Payment[]> {
    return await this.find({
      where: { user: { id: userId } },
      relations: ['paymentOption', 'transaction'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find payments by HMO ID
   */
  async findByHmoId(hmoId: string): Promise<Payment[]> {
    return await this.find({
      where: { hmoId },
      relations: ['user', 'paymentOption', 'transaction'],
      order: { createdAt: 'DESC' },
    });
  }
}
