const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const webdriver = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

const port = 80;
const width = 1200;
const height = 825;

function createDriver() {
    const option = new Options();
    option.addArguments("no-sandbox");
    option.addArguments("window-size=1200,825");
    option.addArguments("headless");
    option.addArguments("disable-dev-shm-usage");
    return new webdriver.Builder().forBrowser('chrome').setChromeOptions(option).build();
};

async function takeScreenshot(driver, url) {
    await driver.get(url);
    await driver.getTitle();
    // image as base64 coded string
    return await driver.takeScreenshot();
};

const driver = createDriver();

// return a screenshot of google calendar
app.get('/calendar', (req, res) => {
  const calendarUrl = "https://calendar.google.com/calendar/u/0/embed?height=825&wkst=2&bgcolor=%23ffffff&ctz=America/Los_Angeles&src=emhhbmd0ZW1wbGFyQGdtYWlsLmNvbQ&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=bHVuYXJfX3poX2NuQGhvbGlkYXkuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=a3RmbnJ2c2lhdmU0ZXM4aHZsOW81ZmJhdDc5cDgxaXNAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&src=emgtY24uY2hpbmEjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23D50000&color=%230B8043&color=%23D81B60&color=%238E24AA&color=%23D81B60&showNav=0&showTabs=0&showPrint=0&showCalendars=1&mode=WEEK";
  takeScreenshot(driver, calendarUrl).then((image) => {
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': image.length
      });
    res.end(Buffer.from(image, "base64"));
  }).catch((reason) => {
      console.error("failed to screenshot calendar due to ", reason);
      res.status(500).send("failed to screenshot calendar");
  });
});

// return a screnshot of a given url
app.get("/screenshot/:url", (req, res) => {
    const url = decodeURIComponent(req.params.url);
    console.log(url);
    takeScreenshot(driver, url).then((image) => {
      res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': image.length
        });
      res.end(Buffer.from(image, "base64"));
    }).catch((reason) => {
        console.error("failed to screenshot the requested url due to ", reason);
        res.status(500).send("failed to screenshot the requested url");
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
