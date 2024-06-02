import autoScroll from "./autoScroll.js";

const scrollAllChannelsToEnd = async (page) => {
  console.log("----- scrolling channels to the bottom \x1b[31mSTARTS\x1b[0m -----\n");
  let i = 1;
  while (true) {
    const elementCount = await page.evaluate(() => {
      return document.querySelectorAll("ytd-item-section-renderer").length;
    });
    await autoScroll(page);
    if (elementCount === i) {
      await autoScroll(page);
      await autoScroll(page);
    } else {
      await autoScroll(page);
      await autoScroll(page);
      break;
    }
    i++;
  }
  console.log("----- scrolling channels to the bottom \x1b[32mDONE\x1b[0m -----\n");
};

export default scrollAllChannelsToEnd;
