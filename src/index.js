const fs = require("fs").promises;
const jd = require('./jd');
const mmb = require('./mmb');

const PAGE = 20;
const KEYWORD = 'n95口罩';

(async () => {
  for (let i = 1; i <= PAGE; ++i) {
    const list = await jd.getGoods(KEYWORD, i);
    await mmb.fetchPrice(list);
    await fs.writeFile(`./data/jd.${i}.json`, JSON.stringify(list));
    console.log(`./data/jd.${i}.json generated!`);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
})();
