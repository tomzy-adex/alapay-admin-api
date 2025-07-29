import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HmoRepository } from './repositories/hmo.repository';
import { INotificationType, ProcessStatus, Status } from 'src/utils/types';
import { AccountApprovalDto } from 'src/user/dto/update-user.dto';
import { SendEmailDto } from 'src/email/dto/send-email.dto';
import { EmailService } from 'src/email/email.service';
import { NotificationRepository } from 'src/notification/repositories/notification.repository';
import { UpdateHmoDto } from './dto/update-hmo.dto';
import { QueryDto } from '../config/dto/query.dto';
import { HealthcarePlanRepository } from './repositories/healthcare-plan.repository';
import { QueryHmoDto, UpdateHmoStatusDto } from './dto/create-hmo.dto';

@Injectable()
export class HmoService {
  constructor(
    private readonly hmoRepository: HmoRepository,
    private readonly emailService: EmailService,
    private readonly notificationRepository: NotificationRepository,
    private readonly healthcarePlanRepository: HealthcarePlanRepository,
  ) {}

  async verifyHmoAccount(id: string, payload: AccountApprovalDto) {
    try {
      const hmo = this.hmoRepository;

      const { status, message } = payload;

      const isHmo = await hmo.findOneBy({ id });

      if (!isHmo) throw new BadRequestException('HMO does not exist.');

      const notification: INotificationType = {
        title: `HMO account has been ${status}.`,
        message,
      };

      const emailPayload: SendEmailDto = {
        to: isHmo.email,
        subject: notification.title,
        html: `Hello ${isHmo.name},
              <br/><br/>
              Your HMO account has been ${status}. See more information below:
              <br/><br/>
             <b>${message}</b>
              `,
      };

      const accountStatus =
        status === ProcessStatus.APPROVED ? Status.ACTIVE : Status.DORMANT;

      await hmo.update(
        { id },
        { status, accountStatus, verificationComments: message },
      );
      await this.notificationRepository.save({ ...notification, hmo: { id } });
      await this.emailService.sendEmail(emailPayload);

      return {
        success: true,
        message: `${isHmo.name} HMO account was successfully ${status}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateHmoProfile(id: string, payload: UpdateHmoDto) {
    try {
      const hmo = await this.hmoRepository.findOneBy({ id });

      if (!hmo) throw new NotFoundException('HMO not found');

      await this.hmoRepository.update({ id }, { ...payload });

      return {
        success: true,
        message: 'Hmo profile updated successfully sent successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  async getHmoById(id: string) {
    try {
      const hmo = await this.hmoRepository.findOne({
        where: { id },
        relations: ['user', 'plans'],
      });

      if (!hmo) throw new NotFoundException('HMO not found');

      // Manually remove password from admin array
      const sanitizedAdmin = hmo.user.map((admin) => ({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        status: admin.status,
        role: admin.role,
      }));

      return {
        success: true,
        message: 'User fetched successfully.',
        data: { ...hmo, admin: sanitizedAdmin },
      };
    } catch (error) {
      console.error('Error fetching HMO account:', error);
      throw error;
    }
  }

  async getHmos(query: QueryDto) {
    try {
      const { page, limit } = query;

      const [hmos, total] = await this.hmoRepository.findAndCount({
        relations: ['plans'],
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });

      if (hmos.length === 0) throw new NotFoundException('HMO not found');

      return {
        success: true,
        message: 'HMOs fetched successfully.',
        data: hmos,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw error;
    }
  }

  async reviewAndApprovePlan(query: QueryHmoDto, payload: UpdateHmoStatusDto) {
    try {
      const { planId, hmoId } = query;
      const { status, comments } = payload;

      const plan = await this.healthcarePlanRepository.findOne({
        where: { id: planId, hmo: { id: hmoId } },
        relations: ['hmo'],
      });

      if (!plan) throw new NotFoundException('Plan not found');

      if (plan.status === Status.ACTIVE) {
        throw new BadRequestException('Plan is already approved');
      }

      const updatedStatus =
        status === Status.ACTIVE
          ? ProcessStatus.APPROVED
          : ProcessStatus.REJECTED;

      await this.healthcarePlanRepository.update(planId, {
        status,
      });

      const notification: INotificationType = {
        title: `HMO plan has been ${updatedStatus}.`,
        message: comments,
      };

      const emailPayload: SendEmailDto = {
        to: plan.hmo.email,
        subject: notification.title,
        html: `Hello ${plan.hmo.name},
              <br/><br/>
              Your HMO plan has been ${updatedStatus}. See more information below:
              <br/><br/>
             <b>${comments}</b>
              `,
      };

      await this.notificationRepository.save({
        ...notification,
        hmo: { id: plan.hmo.id },
      });
      await this.emailService.sendEmail(emailPayload);

      return {
        success: true,
        message: `Plan has been successfully ${status.toLowerCase()}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async getHmoTiers(hmoId: string) {
    try {
      const hmo = await this.hmoRepository.findOne({
        where: { id: hmoId },
        relations: ['accountTiers'],
      });

      if (!hmo) throw new NotFoundException('HMO not found');

      if (!hmo.accountTiers || hmo.accountTiers.length === 0) {
        throw new NotFoundException('No tiers found for this HMO');
      }

      return {
        success: true,
        message: 'HMO tiers fetched successfully.',
        data: hmo.accountTiers,
      };
    } catch (error) {
      console.error('Error fetching HMO tiers:', error);
      throw new InternalServerErrorException('HMO tiers could not be fetched.');
    }
  }
}
