import {
  EMAIL_ACCOUNT_TO_COPY,
  PASSWORD_ACCOUNT_TO_COPY,
  EMAIL_ACCOUNT_COPY,
  PASSWORD_ACCOUNT_COPY,
} from "./credentials.js";
import goToURL from "./goToURL.js";
import fillingEmail from "./fillingEmail.js";
import fillingPassword from "./fillingPassword.js";
import awaitUrl from "./awaitUrl.js";
import scrollAllChannelsToEnd from "./scrollAllChannelsToEnd.js";
import log from "./log.js";

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
const stealth = StealthPlugin();
stealth.enabledEvasions.delete("iframe.contentWindow");
stealth.enabledEvasions.delete("media.codecs");
puppeteer.use(stealth);

import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

puppeteer
  .launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: false,
    args: ["--start-fullscreen"],
  })
  .then(async (browser) => {
    console.time("transfer channels");
    const page = await browser.newPage();
    page.setDefaultTimeout(0);

    await goToURL(
      "1",
      page,
      "https://accounts.google.com/signin/v2/identifier",
    );

    await fillingEmail("2", page, EMAIL_ACCOUNT_TO_COPY);
    await fillingPassword("3", page, PASSWORD_ACCOUNT_TO_COPY);

    await awaitUrl(
      "4",
      " await until you connect (validate Oauth etc...)",
      page,
      "myaccount.google.com",
    );

    await goToURL("5", page, "https://www.youtube.com/feed/channels");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await scrollAllChannelsToEnd(page);

    console.log(
      "\x1b[32mStoring all channels subscribed from the initial account...\x1b[0m\n",
    );
    var all_channels = await page.evaluate(() => {
      var a = document.querySelectorAll("ytd-channel-renderer");
      let channels_array = [];
      for (let step = 0; step < a.length; step++) {
        channels_array.push(
          a[step].querySelector("#content-section #info-section #main-link")
            .href,
        );
      }
      return channels_array;
    });
    console.log("number of channels susbcribed: " + all_channels.length + "\n");
    await log(page);

    await page.goto("https://www.youtube.com/logout");

    const cookies = await page.cookies();
    await page.deleteCookie(...cookies);

    await goToURL(
      "1",
      page,
      "https://accounts.google.com/signin/v2/identifier",
    );

    await fillingEmail("2", page, EMAIL_ACCOUNT_COPY);
    await fillingPassword("3", page, PASSWORD_ACCOUNT_COPY);

    await awaitUrl(
      "4",
      " await until you connect (validate Oauth etc...)",
      page,
      "myaccount.google.com",
    );

    for (let step = 0; step < all_channels.length; step++) {
      try {
        await goToURL(step, page, all_channels[step] + "?sub_confirmation=1");
        await page.waitForFunction(
          () => {
            const element = document.querySelector("tp-yt-paper-dialog");
            return (
              element && window.getComputedStyle(element).display !== "none"
            );
          },
          { timeout: 10000 },
        );
        await page.click("yt-button-renderer#confirm-button");
        await page.waitForFunction(() => {
          const element = document.querySelector("tp-yt-paper-dialog");
          return element && window.getComputedStyle(element).display == "none";
        });
      } catch (error) {
        console.log(
          "\x1b[31mERROR This channel has not been subscribed: \x1b[0m" +
            all_channels[step],
        );
        console.log("\x1b[31mChannel might have been banned\x1b[0m");
        console.log("\x1b[31mOr youtube unique handle (https://www.youtube.com/@unique-handle) is wrong\x1b[0m");
      }
    }

    console.timeEnd("transfer channels");
    await browser.close();
  });
