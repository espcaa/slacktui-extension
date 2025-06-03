(() => {
  const storageItems = [localStorage, sessionStorage];
  for (const storage of storageItems) {
    for (const key in storage) {
      const val = storage[key];
      if (typeof val === "string" && val.includes("xoxc-")) {
        try {
          const obj = JSON.parse(val);
          const teams = obj.teams || {};
          const tokens = Object.values(teams)
            .map((x) => x.token)
            .filter(Boolean);
          if (tokens.length) return tokens[0];
        } catch {
          const match = val.match(/xoxc-[\w-]+/);
          if (match) return match[0];
        }
      }
    }
  }
  return null;
})();