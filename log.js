const log = async (page) => {
  console.log("Current URL:", "\x1b[36m" + await page.url() + "\x1b[0m");
  console.log("Current Title:", "\x1b[33m" + await page.title() + "\x1b[0m");
  console.log("\n");
};

export default log;
