import log from "./log.js";

const goToURL = async (order, page, url) => {
  console.log("\x1b[35m#" + order + " go to ----> " + url + "\x1b[0m");
  await page.goto(url, {
    timeout: 0,
  });
  await log(page);  
};

export default goToURL;
