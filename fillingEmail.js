import log from "./log.js";

const fillingEmail = async (order, page, email_account) => {
  console.log(
    "\x1b[35m#" +
      order +
      " filling input email with : \x1b[0m" +
      "\x1b[100m" +
      "YOUREMAIL@example.com" +
      "\x1b[0m",
  );
 
  await page.evaluate((email) => {
    let arr = [];
    document.querySelector('input[type="email"]').value = email;
    let rr = document.querySelector('input[type="email"]').value;
    arr.push(rr);
    return arr;
  }, email_account);

  console.log("-----waiting for the email to be entered-----\n");
  await page.waitForFunction(() => {
    const emailInput = document.querySelector('input[type="email"]');
    return emailInput.value.length > 0;
  });

  console.log("\x1b[35m#3 Hit Enter email input\x1b[0m");
  await page.keyboard.press("Enter");
  await log(page);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
};

export default fillingEmail;
