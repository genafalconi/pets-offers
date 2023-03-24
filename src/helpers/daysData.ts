export default class DaysData {
  private days = [
    { isOpen: true, weekday: 'lunes', date: '', hours: '14-20' },
    { isOpen: true, weekday: 'miercoles', date: '', hours: '14-20' },
    { isOpen: true, weekday: 'viernes', date: '', hours: '14-20' }
  ]

  getNextDates() {
    // Get today's date
    const today = new Date();

    // Calculate the number of days until next Monday, Wednesday, and Friday
    const daysUntilMonday = (1 + 7 - today.getDay()) % 7;
    const daysUntilWednesday = (3 + 7 - today.getDay()) % 7;
    const daysUntilFriday = (5 + 7 - today.getDay()) % 7;

    // Create Date objects for the next Monday, Wednesday, and Friday
    const nextMonday = new Date(today.getTime() + daysUntilMonday * 24 * 60 * 60 * 1000);
    const nextWednesday = new Date(today.getTime() + daysUntilWednesday * 24 * 60 * 60 * 1000);
    const nextFriday = new Date(today.getTime() + daysUntilFriday * 24 * 60 * 60 * 1000);

    const nextMondayString = nextMonday.toISOString().slice(0, 10)
    const nextWednesdayString = nextWednesday.toISOString().slice(0, 10)
    const nextFridayString = nextFriday.toISOString().slice(0, 10)

    return { monday: nextMondayString, wednesday: nextWednesdayString, friday: nextFridayString }
  }

  getNextDaysData() {
    const nextDays = this.getNextDates()
    this.days.map((elem) => {
      if(elem.weekday === 'lunes') {
        elem.date = nextDays.monday
      }
      if(elem.weekday === 'miercoles') {
        elem.date = nextDays.wednesday
      }
      if(elem.weekday === 'viernes') {
        elem.date = nextDays.friday
      }
    })
    return this.days
  }
}