import log from "./log.js";

const fillingPassword = async (order, page, password_account) => {
  console.log(
    "\x1b[35m#" +
      order +
      " filling input password with : \x1b[0m" +
      "\x1b[100m" +
      "YOURPASSWORD" +
      "\x1b[0m",
  );

    await page.evaluate((password) => {
    document.querySelector('input[type="password"]').value = password;
  }, password_account);

  console.log("-----waiting for the password to be entered-----\n");
  await page.keyboard.press("Enter");
  await log(page);
};

export default fillingPassword;
