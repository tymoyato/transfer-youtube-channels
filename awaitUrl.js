import log from "./log.js";

const awaitUrl = async (order, message, page, url) => {
  console.log(
    "\x1b[35m#" + order + message + "\x1b[0m"
  );
  await page.waitForFunction(
    (urlSubstring) => window.location.href.includes(urlSubstring),
    {},
    url,
  );
  console.log("Successfully navigated to the target URL!");
  await log(page); 
};

export default awaitUrl;
