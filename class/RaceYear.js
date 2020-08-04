import RaceDay from './RaceDay.js';

export default class RaceYear {
  constructor({ raceDays }) {
    this.raceDays = [];
    this.addRaceDay(...raceDays);
  }

  get horses() {
    return new Set(
      this.raceDays.reduce((horses, raceDay) => {
        raceDay.horses.forEach((horse) => horses.add(horse));
        return horses;
      }, new Set())
    );
  }

  get horseCount() {
    return this.horses.size;
  }

  get totalPrice() {
    return this.raceDays.reduce(
      (price, raceDay) => price + raceDay.totalPrice,
      0
    );
  }

  get raceCount() {
    return this.raceDays.reduce(
      (all, raceDay) => all + raceDay.races.length,
      0
    );
  }

  addRaceDay(...raceDays) {
    this.raceDays.push(...raceDays);
  }

  static async loadYear(browser, year) {
    const promises = [];
    for (let month = 1; month <= 12; month++) {
      promises.push(this.loadMonth(browser, year, month));
    }
    const raceDays = [];
    for (const month of await Promise.all(promises)) {
      raceDays.push(...month);
    }
    return new RaceYear({
      raceDays,
    });
  }

  static async loadMonth(browser, year, month) {
    const page = await browser.newPage();
    await page.goto(
      `https://www.hvtonline.de/monatsrennberichte/${year}${month
        .toString(10)
        .padStart(2, '0')}/`
    );
    const raceDayLinks = await page.$$eval(
      '.rboverview a[href*="/rennbericht/20"]',
      (nodes) => nodes.map((n) => n.href)
    );
    await page.close();

    const results = [];
    for (const raceDayLink of raceDayLinks) {
      results.push(await RaceDay.loadDay(browser, raceDayLink));
    }
    return results;
  }
}
