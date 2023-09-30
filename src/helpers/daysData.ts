import { DateTime } from "luxon";

export default class DaysData {
  private days = [
    { open: true, weekday: 'lunes', date: '', from: 14, to: 20 },
    { open: true, weekday: 'miercoles', date: '', from: 14, to: 20 },
    { open: true, weekday: 'viernes', date: '', from: 14, to: 20 },
  ];

  private dateInstance = DateTime.now().setZone('America/Buenos_Aires');
  private dateManager = this.dateInstance.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  getNextDates() {
    // Calculate the number of days until next Monday, Wednesday, and Friday
    const daysUntilMonday = (1 + 7 - this.dateManager.weekday) % 7;
    const daysUntilWednesday = (3 + 7 - this.dateManager.weekday) % 7;
    const daysUntilFriday = (5 + 7 - this.dateManager.weekday) % 7;

    // Create DateTime objects for the next Monday, Wednesday, and Friday
    const nextMonday = this.dateManager.plus({ days: daysUntilMonday });
    const nextWednesday = this.dateManager.plus({ days: daysUntilWednesday });
    const nextFriday = this.dateManager.plus({ days: daysUntilFriday });

    const nextMondayString = nextMonday.toISODate();
    const nextWednesdayString = nextWednesday.toISODate();
    const nextFridayString = nextFriday.toISODate();

    return {
      monday: nextMondayString,
      wednesday: nextWednesdayString,
      friday: nextFridayString,
    };
  }

  getNextDaysData() {
    const nextDays = this.getNextDates();
    const today = this.dateInstance;
    const todayString = today.toISODate();
    const todayHour = today.hour;

    const updatedDays = this.days.map((elem) => {
      let updatedElem = { ...elem }; // Create a copy of the original day

      if (elem.weekday === 'lunes') {
        if (
          elem.date !== todayString ||
          (elem.date === todayString && elem.from > todayHour)
        ) {
          updatedElem.date = nextDays.monday;
        }
      } else if (elem.weekday === 'miercoles') {
        if (
          elem.date !== todayString ||
          (elem.date === todayString && elem.from > todayHour)
        ) {
          updatedElem.date = nextDays.wednesday;
        }
      } else if (elem.weekday === 'viernes') {
        if (
          elem.date !== todayString ||
          (elem.date === todayString && elem.from > todayHour)
        ) {
          updatedElem.date = nextDays.friday;
        }
      }

      return updatedElem;
    });

    const uniqueDays = [];
    updatedDays.forEach((elem) => {
      if (!uniqueDays.some((d) => d.weekday === elem.weekday)) {
        uniqueDays.push(elem);
      }
    });

    this.days = uniqueDays;
    return this.days;
  }
}