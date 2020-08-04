import puppeteer from 'puppeteer';
import RaceYear from './class/RaceYear.js';

async function main() {
  const browser = await puppeteer.launch({ headless: false });

  try{
    console.table(await loadYears(browser, 2014, 2020));
  } catch(e){
    console.error(e)
  }

  await browser.close();
}

async function loadYears(browser, start, end) {
  const raceYears = [];
  for (let year = start; year <= end; year++) {
    console.time('load Year: ' + year);
    const raceYear = await RaceYear.loadYear(browser, 2014);
    raceYears.push({
      year,
      races: raceYear.raceCount,
      horseCount: raceYear.horseCount,
    });
    console.timeEnd('load Year: ' + year);
  }
  return raceYears;
}

main();
