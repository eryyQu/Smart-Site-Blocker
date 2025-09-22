function isBlockedNow(rule) {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = rule.startTime.split(":").map(Number);
  const [endH, endM] = rule.endTime.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  const dayMatch = rule.repeatDaily || (rule.days && rule.days.includes(currentDay));

  if (!dayMatch) return false;

  if (startMinutes < endMinutes) {
    // e.g. 08:00 → 22:00
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    // e.g. 19:30 → 06:00 (overnight)
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
}

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  const { url } = details;
  const data = await chrome.storage.local.get(["rules"]);
  const rules = data.rules || [];

  for (let rule of rules) {
    if (url.includes(rule.domain)) {
      if (isBlockedNow(rule)) {
        chrome.tabs.update(details.tabId, { url: "about:blank" });
      }
    }
  }
});
