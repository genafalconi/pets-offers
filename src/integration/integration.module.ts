import { Module } from '@nestjs/common';
import DaysData from 'src/helpers/daysData';
import { OffersService } from 'src/offers/offers.service';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';

@Module({
  controllers: [IntegrationController],
  providers: [
    IntegrationService,
    OffersService,
    DaysData
  ]
})
export class IntegrationModule {}
