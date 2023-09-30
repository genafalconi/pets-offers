import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import DaysData from 'src/helpers/daysData';
import { InjectModel } from '@nestjs/mongoose';
import { Offer } from 'src/schemas/offers.schema';
import { Model } from 'mongoose';
import { DateTime } from 'luxon';

@Injectable()
export class OffersService {
  private dateIntance: DateTime
  private dateManager: DateTime

  constructor(
    @Inject(DaysData)
    private readonly daysData: DaysData,
    @InjectModel(Offer.name)
    private readonly offerModel: Model<Offer>,
  ) {
    this.dateIntance = DateTime.now().setZone('America/Buenos_Aires');
    this.dateManager = this.dateIntance.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  }

  @Cron('0 0 21 * THU *')
  async createOffers(): Promise<Offer[]> {
    const offersSaved: Offer[] = [];
    const dateToSearch = this.dateManager.toISODate();
    const timeToSearch = this.dateIntance.hour;

    const offerDocs = await this.offerModel.find({
      $or: [
        { date: { $gt: dateToSearch } },
        {
          date: dateToSearch,
          from: { $gt: timeToSearch },
        },
      ],
    });

    if (offerDocs.length < 3) {
      const newDays = this.daysData.getNextDaysData();
      const newDaysPromise = newDays.map(async (elem) => {
        const existDay = await this.offerModel.findOne({ date: elem.date })
        if (!existDay) {
          const offerWeek = new this.offerModel(elem);
          const offerSaved = await this.offerModel.create(offerWeek);
          offersSaved.push(offerSaved);
        } else {
          offersSaved.push(existDay)
        }
      });
      await Promise.all(newDaysPromise);

      Logger.log(offersSaved, 'Offers saved');
      return offersSaved;
    }

    return offerDocs;
  }

  async getOpenOffers(): Promise<Offer[]> {
    const dateToSearch = this.dateManager.toISODate();
    const timeToSearch = this.dateIntance.hour;

    const offerDocs = await this.offerModel
      .find({
        $or: [
          { date: { $gt: dateToSearch } },
          {
            date: dateToSearch,
            from: { $gt: timeToSearch },
          },
        ],
      })
      .sort({ date: 1 });

    return offerDocs;
  }

  async getOrderAddress(addressId: string): Promise<Offer> {
    const offerDoc = await this.offerModel.findById(addressId);
    return offerDoc;
  }

  @Cron('0 10 21 * THU *')
  async disablePastOffers() {
    const dateToSearch = this.dateManager.toISODate();
    const timeToSearch = this.dateIntance.hour;

    await this.offerModel.updateMany(
      {
        $or: [
          { date: { $lt: dateToSearch } },
          { date: dateToSearch, from: { $lt: timeToSearch } },
        ],
      },
      { $set: { open: false } }
    );

    Logger.log('Offers disabled')
  }
}
