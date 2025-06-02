document.getElementById("get").addEventListener("click", function () {
  document.getElementById("content").style.display = "block";
  document.getElementById("errorText").style.display = "none";
});

document.getElementById("get").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    alert("No active tab");
    return;
  }

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        let c = document.cookie;
        let f = [],
          t;
        for (let k in localStorage)
          if (
            typeof localStorage[k] === "string" &&
            localStorage[k].includes("xoxc-")
          )
            f.push(localStorage[k]);
        for (let k in sessionStorage)
          if (
            typeof sessionStorage[k] === "string" &&
            sessionStorage[k].includes("xoxc-")
          )
            f.push(sessionStorage[k]);
        if (f.length) {
          try {
            let o = JSON.parse(f[0]),
              teams = o.teams || {},
              tokens = Object.values(teams)
                .map((x) => x.token)
                .filter(Boolean);
            if (tokens.length) t = tokens[0];
          } catch {
            let m = f[0].match(/xoxc-[\w-]+/);
            if (m) t = m[0];
          }
        }
        return { cookie: c, token: t || "not found" };
      },
    },
    (results) => {
      const content = document.getElementById("content");
      const errorText = document.getElementById("errorText");

      if (chrome.runtime.lastError || !results || !results[0]) {
        content.style.display = "none";
        errorText.style.display = "block";
        errorText.textContent = "Failed to get data";
        return;
      }

      const { cookie, token } = results[0].result;
      document.getElementById("cookieField").value = cookie;
      document.getElementById("tokenField").value = token;
      navigator.clipboard.writeText(cookie + "\n" + token).catch(() => {});

      content.style.display = "block";
      errorText.style.display = "none";
    },
  );
});

document.getElementById("copyCookie").addEventListener("click", function () {
  const cookieField = document.getElementById("cookieField");
  cookieField.select();
  document.execCommand("copy");
});

document.getElementById("copyToken").addEventListener("click", function () {
  const tokenField = document.getElementById("tokenField");
  tokenField.select();
  document.execCommand("copy");
});
