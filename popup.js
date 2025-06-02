document.getElementById("get").addEventListener("click", async () => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length === 0) {
      document.getElementById("output").textContent = "No active tab found.";
      return;
    }
    const url = tabs[0].url;
    const cookie = await chrome.cookies.get({ url, name: "d" });
    if (cookie) {
      document.getElementById("output").textContent = cookie.value;
    } else {
      document.getElementById("output").textContent = "No d cookie found.";
    }
  } catch (err) {
    document.getElementById("output").textContent = `Error: ${err.message}`;
  }
});
