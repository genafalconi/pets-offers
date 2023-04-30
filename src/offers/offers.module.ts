import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist';
import DaysData from 'src/helpers/daysData';
import { Offer, OfferSchema } from 'src/schemas/offers.schema';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Offer.name, schema: OfferSchema }])],
  controllers: [OffersController],
  providers: [OffersService, DaysData],
})
export class OffersModule { }
