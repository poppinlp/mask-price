const got = require("got");
const Promise = require("bluebird");
const { d } = require("./mmb.helper");

const SEARCH_URL = "https://tool.manmanbuy.com/history.aspx";

const fetchPrice = async list => {
  const rsp = await Promise.mapSeries(list, item => got(SEARCH_URL, {
    searchParams: new URLSearchParams({
      action: "gethistory",
      url: item.link,
      token: d.encrypt(item.link, 2, true)
    }),
    responseType: "json"
  }));

  list.forEach((item, idx) => {
    const price = rsp[idx].body;
    if (!price) { item.noHistory = true; return; }
    const history = price.listPrice.sort((a, b) => a.pr - b.pr);
    item.noHistory = false;
    item.days = history.length;
    item.curPrice = price.currentPrice;
    item.lowPrice = history[0].pr;
    item.highPrice = history[item.days - 1].pr;
    item.historyMedian = history[Math.floor(item.days / 2)].pr;
  });
};

module.exports = { fetchPrice };
