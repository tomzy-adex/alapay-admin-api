import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateSuperadminDto, CreateUserDto } from './dto/create-user.dto';
import { EncryptionService } from '../utils/encryption.service';
import { RoleService } from '../role/role.service';
import {
  INotificationType,
  OnboardingType,
  ProcessStatus,
  Status,
  UserRoles,
} from '../utils/types';
import { CreateRoleDto } from '../role/dto/create-role.dto';
import { CacheService } from '../cache/cache.service';
import { transformRoleType } from '../utils/helpers';
import { config } from '../config';
import { EmailService } from '../email/email.service';
import { SendEmailDto } from '../email/dto/send-email.dto';
import { OnboardAccountDto } from './dto/onboard-user.dto';
import { User } from './entities/user.entity';
import { AccountApprovalDto, UpdateUserDto } from './dto/update-user.dto';
import { NotificationRepository } from 'src/notification/repositories/notification.repository';
import { QueryDto } from 'src/config/dto/query.dto';
import { AuthData } from 'src/utils/auth.strategy';
import { HmoRepository } from 'src/hmo/repositories/hmo.repository';
import { Hmo } from 'src/hmo/entities/hmo.entity';
import { CreateHmoDto } from 'src/hmo/dto/create-hmo.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
    private readonly cacheService: CacheService,
    private readonly roleService: RoleService,
    private readonly emailService: EmailService,
    private readonly notificationRepository: NotificationRepository,
    private readonly hmoRepository: HmoRepository,
  ) {}

  async createUser(payload: CreateUserDto) {
    try {
      const user = this.userRepository;

      const { email, password, roleId, phoneNumber } = payload;

      const role = await this.roleService.getRoleById(roleId);
      const hashedPassword = await this.encryptionService.hash(password);
      let hmo: Hmo;

      if (!user) throw new BadRequestException('User model is not loaded.');

      if (!role) throw new NotFoundException('Role does not exist.');

      if (payload.hmoId) {
        hmo = await this.hmoRepository.findOneBy({ id: payload.hmoId });

        if (!hmo) throw new NotFoundException('HMO does not exist.');
      }

      const isUser = await user.findOneBy({ email });

      if (isUser)
        throw new BadRequestException('User with this email already exist.');

      if (phoneNumber) {
        const isPhoneNumber = await user.findOneBy({ phoneNumber });
        if (isPhoneNumber)
          throw new BadRequestException(
            'User with this phone number already exist.',
          );
      }

      const createdUser = await user.save({
        ...payload,
        email: email.toLocaleLowerCase(),
        password: hashedPassword,
        role: { id: role.data.id },
        ...(payload.hmoId ? { hmo: { id: hmo.id } } : {}),
      });

      const adminType = transformRoleType(role.data.permission);
      const subject = `Verify your ${adminType} Account`;

      await this.emailService.sendVerificationEmail(
        email,
        createdUser.firstName,
        subject,
      );

      return {
        success: true,
        message: `${adminType} account created successfully.`,
        data: {
          id: createdUser.id,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          email: createdUser.email,
          role: createdUser.role.permission,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(code: string) {
    try {
      const user = this.userRepository;
      const redisClient = this.cacheService;

      const email = await redisClient.get(`verify-account:${code}`);

      if (!email) {
        throw new BadRequestException('Invalid or expired verification code.');
      }

      const isUser = await user.findOneBy({ email: email as string });

      if (!isUser) throw new NotFoundException('User does not exist.');

      await user.update({ id: isUser.id }, { isEmailVerified: true });

      await redisClient.remove(`verify-account:${code}`);

      return {
        success: true,
        message: `Account verified successfully.`,
      };
    } catch (error) {
      console.error('Error verifying user account:', error);
      throw new InternalServerErrorException(
        'User account could not be verified',
      );
    }
  }

  async createSuperadmin(payload: CreateSuperadminDto) {
    try {
      const { firstName, lastName, middleName, email, phoneNumber, password } =
        payload;

      const role = this.roleService;
      let permission = await role.getRoleByPermission(UserRoles.ALAPAY_ADMIN);

      if (!permission) {
        const roleData: CreateRoleDto = {
          permission: UserRoles.ALAPAY_ADMIN,
        };

        permission = await role.createRole(roleData);
      }

      const dataPayload: CreateUserDto = {
        firstName,
        lastName,
        middleName,
        phoneNumber,
        email,
        password,
        roleId: permission.data.id,
      };

      const superadmin = await this.createUser(dataPayload);
      await this.userRepository.update(
        { id: superadmin.data.id },
        { status: ProcessStatus.APPROVED, accountStatus: Status.ACTIVE },
      );

      return superadmin;
    } catch (error) {
      throw error;
    }
  }

  async generateRegistrationToken(
    email: string,
    roleId: string,
  ): Promise<string> {
    const token = this.encryptionService.generateToken({ email, roleId });
    const redisClient = this.cacheService;

    const data = JSON.stringify({ email, roleId });

    // Store the token in Redis with a TTL (e.g., 24 hours)
    await redisClient.set(`registration:${token}`, data);

    return token;
  }

  async verifyRegistrationToken(
    token: string,
  ): Promise<{ email: string; roleId: string } | null> {
    const redisClient = this.cacheService;
    const data = await redisClient.get(`registration:${token}`);

    if (!data) {
      throw new BadRequestException('Invalid or expired registration link.');
    }

    // Parse the stored JSON to retrieve email and roleId
    const { email, roleId } = JSON.parse(data as string);

    return { email, roleId };
  }

  async sendRegistrationLink(
    authData: AuthData,
    email: string,
    roleId: string,
    onboardingType: OnboardingType,
  ): Promise<void> {
    const token = await this.generateRegistrationToken(email, roleId);
    const role = await this.roleService.getRoleById(roleId);

    if (!role) throw new NotFoundException('Role does not exist.');

    const url = email === authData.email ? config.baseUrl : config.hmoBaseUrl;

    const link = `${url}/api/v1/admin/${roleId}/onboard-${onboardingType}-account?token=${token}`;

    const text = `Please use the following link to complete your registration: <a href="${link}">Link</a>`;
    const adminType = transformRoleType(onboardingType);
    const subject = `${adminType} Registration`;

    const emailPayload: SendEmailDto = { to: email, subject, html: text };

    // Send email (assume an email service is set up)
    await this.emailService.sendEmail(emailPayload);
  }

  async registerHmoAdmin(
    adminRoleId: string,
    token: string,
    payload: CreateUserDto,
  ) {
    try {
      const { email, roleId } = await this.verifyRegistrationToken(token);

      if (!email && !roleId) {
        throw new BadRequestException('Invalid or expired registration link.');
      }

      const isUser = await this.userRepository.findOneBy({ email });

      if (isUser)
        throw new BadRequestException('User with this email already exist.');

      if (isUser?.phoneNumber === payload.phoneNumber)
        throw new BadRequestException(
          'User with this phone number already exist.',
        );

      // Proceed to create the user with the email from the token
      const role = await this.roleService.getRoleById(roleId);

      if (adminRoleId !== role.data.id)
        throw new ForbiddenException(
          'Invalid role params or invlalid role ID query.',
        );

      const adminType = transformRoleType(role.data.permission);

      const user = await this.createUser({
        ...payload,
        roleId: role.data.id,
      });

      // Optionally delete the token after verification to prevent reuse
      await this.cacheService.remove(`registration:${token}`);

      return {
        success: true,
        message: `${adminType} registered successfully.`,
        data: {
          id: user.data.id,
          email: user.data.email,
          role: user.data.role,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async registerHmo(adminRoleId: string, token: string, payload: CreateHmoDto) {
    try {
      const { email, roleId } = await this.verifyRegistrationToken(token);
      const role = await this.roleService.getRoleById(roleId);
      const hmo = this.hmoRepository;

      if (!email && !roleId) {
        throw new BadRequestException('Invalid or expired registration link.');
      }

      if (!role) throw new NotFoundException('Role does not exist.');

      const isHmo = await this.hmoRepository.findOneBy({ email });

      if (isHmo)
        throw new BadRequestException('HMO with this email already exist.');

      if (isHmo?.phoneNumber === payload.phoneNumber)
        throw new BadRequestException(
          'HMO with this phone number already exist.',
        );

      if (adminRoleId !== role.data.id)
        throw new ForbiddenException(
          'Invalid role params or invlalid role ID query.',
        );

      const created = await hmo.save({ ...payload });

      return {
        success: true,
        message: `HMO account created registered successfully.`,
        data: {
          id: created.id,
          email: created.email,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async onboardAccount(payload: OnboardAccountDto, authData: AuthData) {
    const { emails, roleId, onboardingType } = payload;

    for (const email of emails) {
      try {
        await this.sendRegistrationLink(
          authData,
          email,
          roleId,
          onboardingType,
        );
      } catch (error) {
        console.error(
          `Failed to send registration link to ${email}: ${error.message}`,
        );
        throw new InternalServerErrorException(
          'Failed to send registration link',
        );
      }
    }

    return {
      success: true,
      message: 'Registration link(s) sent successfully.',
    };
  }

  async accountApproval(id: string, payload: AccountApprovalDto) {
    try {
      const { status, message } = payload;
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
      });

      if (!user) throw new NotFoundException('User not found.');

      if (user.status === ProcessStatus.APPROVED)
        throw new ForbiddenException('This account has been approved.');

      const adminType = transformRoleType(user.role.permission);

      const notification: INotificationType = {
        title: `${adminType} has been ${status}.`,
        message,
      };

      const emailPayload: SendEmailDto = {
        to: user.email,
        subject: notification.title,
        html: `Hello ${user.firstName},
        <br/><br/>
        Your ${adminType} account has been ${status}. See more information below:
        <br/><br/>
       <b>${message}</b>
        `,
      };

      const accountStatus =
        status === ProcessStatus.APPROVED ? Status.ACTIVE : Status.DORMANT;

      await this.userRepository.update({ id }, { status, accountStatus });
      await this.notificationRepository.save({ ...notification, user: { id } });
      await this.emailService.sendEmail(emailPayload);

      return {
        success: true,
        message: `${user.firstName} ${adminType} account was successfully ${status}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async deactivateAccount(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) throw new NotFoundException('User not found.');

      if (user.accountStatus === Status.SUSPENDED)
        throw new ForbiddenException('This account is already deactivated.');

      await this.userRepository.update(
        { id },
        { accountStatus: Status.SUSPENDED },
      );

      return {
        success: true,
        message: 'Account deactivated successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  async linkAdminAccountToHmo(adminId: string, hmoId: string) {
    try {
      const user = this.userRepository;

      const hmo = await this.hmoRepository.findOneBy({ id: hmoId });
      const admin = await user.findOne({
        where: { id: adminId },
        relations: ['role'],
      });

      if (!hmo && !admin) throw new NotFoundException('User or HMO not found.');

      if (admin.hmo.id === hmoId)
        throw new ForbiddenException(
          'This HMO has already linked to the user.',
        );

      if (hmo.accountStatus !== Status.ACTIVE)
        throw new ForbiddenException(
          `This HMO account is ${hmo.accountStatus}.`,
        );

      await user.update({ id: adminId }, { hmo: { id: hmo.id } });

      return {
        success: true,
        message: `${admin.firstName} ${admin.role.permission} profile successfully linked to ${hmo.name} HMO.`,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateAdminProfile(id: string, payload: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) throw new NotFoundException('User not found');

      await this.userRepository.update({ id }, { ...payload });

      return {
        success: true,
        message: 'Admin profile updated successfully sent successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdminById(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role', 'hmo'],
      });

      if (!user) throw new NotFoundException('User not found');

      if (id !== user.id || user.role.permission !== UserRoles.ALAPAY_ADMIN) {
        throw new BadRequestException(
          'You are not authorzed to perform this action',
        );
      }

      delete user.password;

      return {
        success: true,
        message: 'User fetched successfully.',
        data: user,
      };
    } catch (error) {
      console.error('Error fetching user account:', error);
      throw new InternalServerErrorException(
        'User account could not be fetched.',
      );
    }
  }

  async getAdminsbyRoleId(
    id: string,
    query: QueryDto,
  ): Promise<{
    data: Partial<User>[];
    success: boolean;
    message: string;
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    try {
      const { page, limit } = query;

      const [users, total] = await this.userRepository.findAndCount({
        relations: ['role', 'hmo'],
        where: { role: { id } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          role: { permission: true },
          createdAt: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });

      if (users.length === 0) throw new NotFoundException('User not found');

      return {
        success: true,
        message: `Admins with role ID ${id} fetched successfully.`,
        data: users,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error fetching users account:', error);
      throw new InternalServerErrorException(
        'Users account could not be fetched.',
      );
    }
  }

  async getAdmins(query: QueryDto): Promise<{
    data: Partial<User>[];
    success: boolean;
    message: string;
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    try {
      const { page, limit } = query;

      const [users, total] = await this.userRepository.findAndCount({
        relations: ['role', 'hmo'],
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          role: { permission: true },
          createdAt: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });

      if (users.length === 0) throw new NotFoundException('User not found');

      return {
        success: true,
        message: 'Admins fetched successfully.',
        data: users,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw error;
    }
  }
}
