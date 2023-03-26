import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
} from 'firebase-admin/firestore';
import { CronExpression } from '@nestjs/schedule';
import dateFormat from 'src/helpers/dateFormat';
import { firebaseFirestore } from 'src/firebase/firebase.app';
import DaysData from 'src/helpers/daysData';

@Injectable()
export class OffersService {
  private offersCollection: CollectionReference;

  constructor(
    @Inject(DaysData)
    private readonly daysData: DaysData,
  ) {
    this.offersCollection = firebaseFirestore.collection('offer');
  }

  private readonly logger = new Logger();

  // @Cron(CronExpression.EVERY_SECOND)
  async createOffers(): Promise<DocumentData> {
    const todayDate = new Date();
    const offersSaved: Array<DocumentData> = [];
    const dateToSearch = todayDate.toISOString().slice(0, 10);

    const offerDoc = await this.offersCollection
      .where('date', '>=', dateToSearch)
      .get();

    if (offerDoc.empty) {
      const newDays = this.daysData.getNextDaysData();
      const newDaysPromise = newDays.map(async (elem) => {
        const offerWeek = this.offersCollection.doc();
        await offerWeek.set(Object.assign({}, elem));

        const offerSaved = await offerWeek.get();
        const offerData = offerSaved.data();
        offersSaved.push(offerData);
      });
      await Promise.all(newDaysPromise);

      Logger.log(offersSaved, 'Offers saved');
      return offersSaved;
    }

    return offerDoc.docs.map((elem) => elem.data());
  }

  async getOpenOffers(): Promise<DocumentData> {
    const todayDate = new Date();
    const dateToSearch = todayDate.toISOString().slice(0, 10);

    const offerDoc = await this.offersCollection
      .where('date', '>=', dateToSearch)
      .get();

    if (!offerDoc.empty) {
      return offerDoc.docs.map((elem) => {
        const offer = elem.data();
        return { ...offer, id: elem.id };
      });
    }
    return [];
  }

  async getOrderAddress(addressId: string): Promise<DocumentData> {
    const offerDoc = await this.offersCollection.doc(addressId).get();
    return offerDoc.data();
  }
}
