import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ValidationError } from 'apollo-server-express'

@Injectable()
export class ExchangeStoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAny() {
    const exchange = await this.prismaService.exchange.findFirst();
    return exchange;
  }

  async findById(id: string) {
    const exchange = await this.prismaService.exchange.findFirst({ where: { id }, include: { userPermissions: { include: { user: true } } } });
    if (!exchange) throw new ValidationError("Exchange not found")
    return exchange;
  }

  async createOrGetInvite(exchangeId: string, userId: string) {
    return await this.prismaService.invite.upsert({
      where: { key: { userId, exchangeId }},
      create: { userId, exchangeId },
      update: { }
    });
  }

  async checkInvite(inviteId: string, userId: string) {
    const invite = await this.prismaService.invite.findFirst({ where: { id: inviteId } });
    if (invite) {
      const userPermission = await this.prismaService.userPermission.findFirst({ where: { userId, exchangeId: invite.exchangeId } });
      if (userPermission) {
        throw new ValidationError("Already a member of this exchange")
      }
      return true
    }
    throw new ValidationError("Invite not found")
  }

  async joinExchange(userId: string, inviteId: string) {
    const invite = await this.prismaService.invite.findFirst({ where: { id: inviteId } });
    const exchange = await this.prismaService.exchange.findFirst({ where: { id: invite.exchangeId } });

    if (exchange) {
      const userPermission = await this.prismaService.userPermission.findFirst({ where: { userId, exchangeId: invite.exchangeId } });
      if (userPermission) {
        throw new ValidationError("Already a member of this exchange")
      }

      return await this.prismaService.userPermission.create({
        data: {
          userId,
          exchangeId: invite.exchangeId,
          permission: "USER"
        },
        include: { exchange: true }
      });
    }

    throw new ValidationError("Already a member of this exchange")
  }

  async createTestExchange(userId: string) {
    const exchange = await this.prismaService.exchange.create({ data: {} });
    await this.prismaService.userPermission.create({ data: { userId, exchangeId: exchange.id, permission: "ADMIN" }});
    return exchange;
  }
}
