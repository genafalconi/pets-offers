import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DocumentData } from 'firebase-admin/firestore';
import { IntegrationService } from './integration.service';

@Controller('integration')
export class IntegrationController {

  constructor(
    @Inject(IntegrationService)
    private readonly integrationService: IntegrationService
  ){}

  @MessagePattern({ cmd: 'order-offer' })
  async getOrderCart(addressId: string): Promise<DocumentData> {
    return await this.integrationService.getOrderOffer(addressId)
  }
}
