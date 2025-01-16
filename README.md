WEB CRAWLER

This project is a web crawler built using Playwright Extra with the stealth plugin to bypass bot detection. It scrapes specific links from multiple websites based on predefined filter keywords and saves the scraped links into a JSON file.

FEATURES:

--Bypasses bot detection using the Stealth plugin.

--Efficiently fetches product-related links from various e-commerce websites.

--Scrolls through pages dynamically to load additional links.

--Filters links based on predefined keywords.

--Saves the results in a scraped_links.json file.

PREREQUISITES:

Before running this project, make sure you have the following installed:

--Node.js (v16 or higher is recommended).

INSTALLATION:

Clone this repository or copy the script into your project directory:

--git clone <repository-url>

INSTALL THE REQUIRED DEPENDENCIES:

--npm install playwright-extra puppeteer-extra-plugin-stealth fs

USAGE:

--Update the urls array in the script with the list of websites you want to scrape.

--Run the script:(node index.js)

--After execution, the scraped links will be saved in a file named scraped_links.json in the project directory.

CONFIGURATION

==Filter Keywords:

--The script filters links using predefined keywords such as /product/, /shop/, /prd/, and more. To modify these keywords, update the filterKeywords array in the script.

==Scroll Limit

--By default, the script scrolls a maximum of 20 times per website to load more links. You can adjust this by modifying the scrollCount limit in the script.


Notes

Headless Mode: The scraper runs in headless mode by default. You can disable headless mode for debugging by changing:

const browser = await chromium.launch({ headless: true });

to:

const browser = await chromium.launch({ headless: false });

Timeouts: The script uses a 60-second timeout for page loads and selectors. You can adjust these values in the goto and waitForSelector methods.

LIMITATION:

**Some websites may still detect scraping attempts despite using the Stealth plugin.**

AUTHOR:

Kaushal

linkedIn-www.linkedin.com/in/kaushal-70156a170
git-https://github.com/kaushalkkkr8
