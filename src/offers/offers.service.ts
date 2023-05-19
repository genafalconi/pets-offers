import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import DaysData from 'src/helpers/daysData';
import { InjectModel } from '@nestjs/mongoose';
import { Offer } from 'src/schemas/offers.schema';
import { Model } from 'mongoose';

@Injectable()
export class OffersService {
  constructor(
    @Inject(DaysData)
    private readonly daysData: DaysData,
    @InjectModel(Offer.name)
    private readonly offerModel: Model<Offer>,
  ) {}

  private readonly logger = new Logger();

  @Cron('0 20 * * 4')
  async createOffers(): Promise<Offer[]> {
    const todayDate = new Date();
    const offersSaved: Offer[] = [];
    const dateToSearch = todayDate.toISOString().slice(0, 10);
    const timeToSearch = todayDate.toLocaleTimeString().slice(0, 2);

    const offerDocs = await this.offerModel.find({
      $or: [
        { date: { $gt: dateToSearch } },
        {
          date: dateToSearch,
          $expr: {
            $gte: [
              { $toInt: { $arrayElemAt: [{ $split: ['$hours', '-'] }, 0] } },
              parseInt(timeToSearch),
            ],
          },
        },
      ],
    });

    if (offerDocs.length === 0) {
      const newDays = this.daysData.getNextDaysData();
      const newDaysPromise = newDays.map(async (elem) => {
        const offerWeek = new this.offerModel(elem);
        const offerSaved = await offerWeek.save();
        offersSaved.push(offerSaved);
      });
      await Promise.all(newDaysPromise);

      Logger.log(offersSaved, 'Offers saved');
      return offersSaved;
    }

    return offerDocs;
  }

  async getOpenOffers(): Promise<Offer[]> {
    const activeOffers: Offer[] = [];

    const todayDate = new Date();
    const dateToSearch = todayDate.toISOString().slice(0, 10);
    const timeToSearch = todayDate.toLocaleTimeString().slice(0, 2);

    const offerDocs = await this.offerModel
      .find({
        $or: [
          { date: { $gt: dateToSearch } },
          {
            date: dateToSearch, 
            $expr: {
              $gte: [
                { $toInt: { $arrayElemAt: [{ $split: ['$hours', '-'] }, 0] } },
                parseInt(timeToSearch),
              ],
            },
          },
        ],
      })
      .sort({ date: 1 });

    for (const offer of offerDocs) {
      if (
        todayDate.toISOString().slice(0, 10) ===
        new Date(offer.date).toISOString().slice(0, 10)
      ) {
        if (offer.hours.slice(0, 2) > todayDate.getHours().toString()) {
          activeOffers.push(offer);
        }
      } else {
        activeOffers.push(offer);
      }
    }
    
    return activeOffers;
  }

  async getOrderAddress(addressId: string): Promise<Offer> {
    const offerDoc = await this.offerModel.findById(addressId);
    return offerDoc;
  }

  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  async disablePastOffers() {
    const todayDate = new Date();
    const dateToSearch = todayDate.toISOString().slice(0, 10);
    const timeToSearch = todayDate.toLocaleTimeString().slice(0, 2);

    const offerDocs = await this.offerModel.find({
      $or: [
        { date: { $lt: dateToSearch } },
        {
          date: dateToSearch,
          $expr: {
            $lt: [
              { $toInt: { $arrayElemAt: [{ $split: ['$hours', '-'] }, 0] } },
              parseInt(timeToSearch),
            ],
          },
        },
      ],
    });

    for (const offer of offerDocs) {
      await this.offerModel.updateOne(
        { _id: offer._id },
        { $set: { open: false } },
      );
    }
  }
}
