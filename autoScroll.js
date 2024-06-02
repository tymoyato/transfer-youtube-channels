const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let lastScrollTop = 0;
      const distance = 1000;
      const maxScrollAttempts = 10;
      let scrollAttempts = 0;

      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        const currentScrollTop = document.documentElement.scrollTop;

        if (
          (currentScrollTop === lastScrollTop &&
            scrollAttempts >= maxScrollAttempts) ||
          currentScrollTop + window.innerHeight >=
            document.documentElement.scrollHeight
        ) {
          clearInterval(timer);
          resolve();
        } else {
          if (currentScrollTop === lastScrollTop) {
            scrollAttempts++;
          } else {
            scrollAttempts = 0;
          }
          lastScrollTop = currentScrollTop;
        }
      }, 100);
    });
  });
};

export default autoScroll;
