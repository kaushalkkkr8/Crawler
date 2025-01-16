const { chromium } = require("playwright-extra");
const stealth = require('puppeteer-extra-plugin-stealth')()

chromium.use(stealth)
const fs = require("fs");

const urls = [
  "https://www.ajio.com/s/bbsdc24-min-30-percent-off-5629-48191",
  "https://www.bewakoof.com/shirts",
  "https://www.ebay.com/b/Auto-Parts-Accessories/6028/bn_569479?_trkparms=parentrq%3A6a919c7f1940ab7319c20cb9fffffc86%7Cpageci%3Aeb854d1c-d354-11ef-8cb0-7a3022a18486%7Cc%3A3%7Ciid%3A1%7Cli%3A8874",
  "https://www.target.com/",
  "https://www.bestbuy.com/site/outlet-refurbished-clearance/clearance-electronics/pcmcat748300666044.c?id=pcmcat748300666044",
  "https://www.overstock.com/collections/home-decor",
  "https://www.asos.com/men/ctas/curated-category-3/cat/?cid=51451&ctaref=hp%7Cmw%7Cprime%7Cfeature%7C2%7Ccategory%7Ccoldweather",
  "https://www.bestbuy.com/",
  "https://www.overstock.com/",
  "https://www.kroger.com/",
  "https://www.ikea.com/in/en/cat/beds-bm003/",
  "https://www.allbirds.com/"
];


(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const results = {};

  try {
    for (const url of urls) {
      const page = await context.newPage();

      await page.route("**/*", (route) => {
        const resourceType = route.request().resourceType();
        if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
          route.abort();
        } else {
          route.continue();
        }
      });

      let links = [];
      let scrollCount = 0;

      try {
      
        await page.goto(url, { waitUntil: "load", timeout: 60000 });
        await page.waitForSelector("a", { timeout: 60000 });

      
        let isPageStable = false;
        let previousHeight = 0;

        while (!isPageStable) {
          const currentHeight = await page.evaluate(() => document.body.scrollHeight);
          const filterKeywords = [
            "/pl/",
            "/s/",
            "/p/",
            "/pr/",
            "/prd/",
            "/prds/",
            "/pro/",
            "/prod/",
            "/prods/",
            "/produ/",
            "/produc/",
            "/product/",
            "/products/",
            "/prdt/",
            "/prdts/",
            "/prdct/",
            "/prdcts/",
            "/b/",
            "/ip/",
            "/listing/",
            "/site/",
            "/collections/",
            ".product.",
            "/pdp/",
            "/shop/"
          ];
          const newLinks = await page.$$eval(
            "a",
            (as, keywords) => as.map((a) => a.href).filter((link) => keywords.some((keyword) => link.includes(keyword))),
            filterKeywords // Pass filterKeywords as an argument
          );
          links = [...links, ...newLinks]; 

          console.log(`Scroll #${++scrollCount}: Found ${links.length} links`);

       
          await page.evaluate(() => window.scrollBy(0, window.innerHeight));
          await page.waitForTimeout(1000); 
          
          if (currentHeight !== previousHeight) {
            previousHeight = currentHeight;
          } else {
            isPageStable = true;
          }

       
          if (scrollCount > 20) {
            console.warn(`Reached maximum scroll limit for ${url}`);
            break;
          }
        }

        console.log(`Total links scraped from ${url}: ${links.length}`);
        console.log(new Set([...links]));
        results[url] = links
      } catch (err) {
        console.error(`Error scraping ${url}: ${err.message}`);
      } finally {
        await page.close();
      }
    }
    fs.writeFileSync("scraped_links.json", JSON.stringify(results, null, 2));
    console.log("Scraped data has been saved to scraped_links.json");
  } catch (err) {
    console.error(`Unexpected error: ${err.message}`);
  } finally {
    await browser.close();
  }
})();
