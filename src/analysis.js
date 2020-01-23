const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const PAGE = 20;

(async () => {
  const output = {};
  const data = await Promise.all(
    Array.from({ length: PAGE }, (v, i) => i + 1).map(i =>
      fs.readFile(path.join(DATA_DIR, `jd-2.${i}.json`), {
        encoding: 'utf8'
      })
    )
  );

  // total
  const list = data.reduce((prev, cur) => prev.concat(JSON.parse(cur)), []);
  output.total = list.length;
  console.log(`total ${list.length}`);

  // ad
  const ad = list.filter(item => item.isAd);
  const adNoHistory = ad.filter(item => item.noHistory);
  output.ad = ad.length;
  output.adNoHistory = adNoHistory.length;
  console.log(`ad shop ${ad.length}, ad no history ${adNoHistory.length}`);

  // no history
  const noHistory = list.filter(item => item.noHistory);
  const newHistory = list.filter(item => !item.noHistory && item.days <= 5);
  output.noHistory = noHistory.length;
  output.newHistory = newHistory.length;
  console.log(`no history ${noHistory.length}, history less than 5 days ${newHistory.length}`);
  console.log(`history more than 5 days ${list.length - noHistory.length - newHistory.length}`);

  // higher price
  const highPrice = list.filter(item => !item.noHistory && item.curPrice > item.historyMedian);
  const highRatio = highPrice.map(item => ({
    shop: item.shop,
    link: item.link,
    ratio: item.curPrice / item.historyMedian * 100
  })).sort((a, b) => a.ratio - b.ratio).map(item => (item.ratio = item.ratio.toFixed(2) + '%', item));
  output.highPrice = highPrice;
  output.highRatio = highRatio;
  console.log(`higher price ${highPrice.length}`);
  console.log(`higher ratio ${JSON.stringify(highRatio)}`);

  // lower price
  const lowPrice = list.filter(item => !item.noHistory && item.curPrice < item.historyMedian);
  const lowRatio = lowPrice.map(item => ({
    shop: item.shop,
    link: item.link,
    ratio: item.curPrice / item.historyMedian * 100
  })).sort((a, b) => a.ratio - b.ratio).map(item => (item.ratio = item.ratio.toFixed(2) + '%', item));
  output.lowPrice = lowPrice;
  output.lowRatio = lowRatio;
  console.log(`low price ${lowPrice.length}`);
  console.log(`lower ratio ${JSON.stringify(lowRatio)}`);

  await fs.writeFile(path.join(DATA_DIR, 'analysis-2.json'), JSON.stringify(output));
  console.log('analysis.json generated!');
})();