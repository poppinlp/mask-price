const got = require("got");
const $ = require("cheerio");

const SEARCH_URL = 'https://search.jd.com/s_new.php';
const HEADERS = {
  referer: "https://search.jd.com",
  "x-requested-with": "XMLHttpRequest"
};

const getGoods = async (keyword, page) => {
  const rsp = await got(SEARCH_URL, {
      searchParams: new URLSearchParams({
        keyword,
        page,
        enc: 'utf-8'
      }),
      headers: HEADERS
    }
  );
  const $dom = $.load(rsp.body);
  const list = $dom('.gl-item').map((idx, ele) => {
    const $anchor = $(ele).find('.p-name a');
    const $shop = $(ele).find('.p-shop');
    const shopId = $shop.data('shopid');
    return {
      name: $anchor.find('em').text(),
      link: (shopId ? '' : 'https:') + $anchor.attr('href'),
      isAd: Boolean(shopId),
      shop: shopId || $shop.find('span').text()
    };
  });

  return Array.from(list);
};

module.exports = { getGoods };