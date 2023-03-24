import { Module } from '@nestjs/common';
import DaysData from 'src/helpers/daysData';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';

@Module({
  controllers: [OffersController],
  providers: [
    OffersService,
    DaysData
  ]
})
export class OffersModule {}
