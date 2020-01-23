const fs = require("fs").promises;
const jd = require('./jd');
const mmb = require('./mmb');

const PAGE = 20;
// const KEYWORD = 'n95口罩';
const KEYWORD = '医用外科口罩';

(async () => {
  for (let i = 1; i <= PAGE; ++i) {
    const list = await jd.getGoods(KEYWORD, i);
    await mmb.fetchPrice(list);
    await fs.writeFile(`./data/jd-2.${i}.json`, JSON.stringify(list));
    console.log(`./data/jd-2.${i}.json generated!`);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
})();
