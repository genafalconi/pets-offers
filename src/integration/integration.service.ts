import { Inject, Injectable } from '@nestjs/common';
import { DocumentData } from 'firebase-admin/firestore';
import { OffersService } from 'src/offers/offers.service';

@Injectable()
export class IntegrationService {

  constructor(
    @Inject(OffersService)
    private readonly offersService: OffersService
  ) { }

  async getOrderOffer(addressId: string): Promise<DocumentData> {
    return await this.offersService.getOrderAddress(addressId)
  }
}
