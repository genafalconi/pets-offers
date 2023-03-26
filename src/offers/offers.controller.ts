import { Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { DocumentData } from 'firebase-admin/firestore';
import { FirebaseAuthGuard } from 'src/firebase/firebase.auth.guard';
import { OffersService } from './offers.service';

@UseGuards(FirebaseAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(
    @Inject(OffersService)
    private readonly offersService: OffersService,
  ) {}

  @Post('/new')
  async createOffers(): Promise<DocumentData> {
    return await this.offersService.createOffers();
  }

  @Get('/open')
  async getOpenOffers(): Promise<DocumentData> {
    return await this.offersService.getOpenOffers();
  }
}
