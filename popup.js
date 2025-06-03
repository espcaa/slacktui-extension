document.getElementById("get").addEventListener("click", async () => {
  document.getElementById("content").style.display = "none";
  document.getElementById("errorText").style.display = "none";

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    document.getElementById("errorText").style.display = "block";
    document.getElementById("errorText").textContent = "No active tab found.";
    return;
  }

  // Get cookies for current tab URL here (extension context)
  browser.cookies.getAll({ url: tab.url }).then(async (cookies) => {
    const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

    // Now inject script to get token from localStorage/sessionStorage
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content-script.js"]
    }).then((results) => {
      const token = results?.[0]?.result || "not found";

      const json = `${cookieString}||${token}`;

      document.getElementById("jsonField").value = json;
      navigator.clipboard.writeText(json).catch(() => {});

      document.getElementById("content").style.display = "block";
    });
  });
});
