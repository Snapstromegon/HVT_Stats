import Race from './Race.js';

export default class RaceDay {
  constructor({ date, races, place }) {
    this.date = date;
    this.races = [];
    this.place = place;
    this.addRace(...races);
  }

  get horses() {
    return new Set(
      this.races.reduce((horses, race) => {
        race.horses.forEach((horse) => horses.add(horse));
        return horses;
      }, new Set())
    );
  }

  get totalPrice() {
    return this.races.reduce((price, race) => price + race.price, 0);
  }

  addRace(...races) {
    this.races.push(...races);
  }

  static async loadDay(browser, link) {
    const page = await browser.newPage();
    await page.goto(link);
    const place = await page.$(
      '#content #left h2',
      (node) => node.innerHTML.split('<br')[0]
    );

    const raceNodes = await page.$$('.raceheader');

    const results = [];
    for (const raceNode of raceNodes) {
      results.push(await Race.load(raceNode));
    }
    await page.close();
    return new RaceDay({
      place,
      races: results,
      date: link.split('/').slice(-1)[0],
    });
  }
}
