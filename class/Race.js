export default class Race {
  constructor({ horses = [], price }) {
    this.horses = new Set(horses);
    this.price = price;
  }

  addHorse(...horses) {
    for (const horse of horses) {
      this.horses.add(horse);
    }
  }

  removeHorse(...horses) {
    for (const horse of horses) {
      this.horses.delete(horse);
    }
  }

  static async load(node) {
    return new Race({
      price: await node.$eval('span', (s) => s.innerText.split(': ')[1]),
      horses: await node.$$eval('tr', (nodes) =>
        Array.from(nodes)
          .filter((tr) => tr.querySelectorAll('td').length == 6)
          .map((tr) => tr.querySelectorAll('td')[1].innerText)
      ),
    });
  }
}
