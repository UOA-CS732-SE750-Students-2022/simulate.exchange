import { CreateInviteInput } from "./dto/create-invite.input";
import { Resolver, Query, Args, ID, Mutation } from "@nestjs/graphql";
import { ExchangesService } from "./exchanges.service";
import { Exchange } from "./entities/exchange.entity";
import { Invite } from "./entities/invite.entity";
import { CurrentUser } from "../../util/current-user.decorator";
import { DecodedIdToken } from "firebase-admin/auth";
import { UseGuards } from "@nestjs/common";
import { FirebaseGuard } from "../../middleware/firebase.guard";
import { UserPermission } from "../users/entities/permissions.entity";
import { CreateExchangeInput } from "./dto/create-exchange.input";
import { AddInstrumentDto } from "./dto/add-instrument.input";

@UseGuards(FirebaseGuard)
@Resolver(() => Exchange)
export class ExchangesResolver {
  constructor(private readonly exchangesService: ExchangesService) {}

  @Query(() => Exchange, { name: "exchange" })
  async findExchange(@Args("id", { type: () => ID }) id: string) {
    return await this.exchangesService.findOne(id);
  }

  @Mutation(() => Invite)
  async createInvite(
    @Args("createInviteInput") createInviteInput: CreateInviteInput,
    @CurrentUser() name: DecodedIdToken,
  ) {
    createInviteInput.userId = name.uid;
    return await this.exchangesService.createInvite(createInviteInput);
  }

  @Query(() => Boolean)
  async checkInvite(
    @Args("id", { type: () => ID }) inviteId: string,
    @CurrentUser() name: DecodedIdToken,
  ) {
    return await this.exchangesService.checkInvite(inviteId, name.uid);
  }

  @Mutation(() => UserPermission)
  async joinExchange(
    @CurrentUser() name: DecodedIdToken,
    @Args("id") inviteId: string,
  ) {
    return await this.exchangesService.joinExchange(name.uid, inviteId);
  }

  @Mutation(() => Exchange)
  async createTestExchange(@CurrentUser() name: DecodedIdToken) {
    return await this.exchangesService.createTestExchange(name.uid);
  }

  @Mutation(() => Exchange)
  async createExchange(
    @CurrentUser() user: DecodedIdToken,
    @Args("exchangeData") name: CreateExchangeInput,
  ) {
    return await this.exchangesService.createExchange(user.uid, name);
  }

  @Mutation(() => Boolean)
  async addInstrument(
    @CurrentUser() user: DecodedIdToken,
    @Args("exchangeId") exchangeId: string,
    @Args("instrument") instrument: AddInstrumentDto,
  ) {
    await this.exchangesService.addInstrument(user.uid, exchangeId, instrument);
    return true;
  }
}
