import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../config/repository/base-entity';
import { User } from '../../user/entities/user.entity';
import { ProcessStatus, PaymentMethod } from '../../utils/types';
import { PaymentOption } from './payment-option.entity';
import { PlanSubscription } from '../../hmo/entities/plan-subscription.entity';
import { Transaction } from './transaction.entity';

@Entity('payments')
export class Payment extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: ProcessStatus, default: ProcessStatus.PENDING })
  status: ProcessStatus;

  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @Column({ nullable: true })
  receiptUrl?: string;

  @Column({ nullable: true, unique: true })
  transactionReference?: string;

  @Column({ nullable: true })
  hmoId?: string;

  @Column({ nullable: true })
  planId?: string;

  @Column({ nullable: true })
  paymentOptionId?: string;

  @Column({ nullable: true })
  customerEmail?: string;

  @Column({ nullable: true })
  customerPhone?: string;

  @Column({ nullable: true })
  customerName?: string;

  @Column({ nullable: true })
  paymentDate?: Date;

  @Column({ nullable: true })
  failureReason?: string;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @ManyToOne(() => PaymentOption, (option) => option.payment)
  paymentOption: PaymentOption;

  @OneToMany(() => PlanSubscription, (subscription) => subscription.payment, {
    cascade: true,
  })
  subscriptions: PlanSubscription[];

  @ManyToOne(() => Transaction, (transaction) => transaction.payments, {
    cascade: true,
  })
  transaction: Transaction;
}
