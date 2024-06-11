import { logEvent } from "firebase/analytics";
import { appAnalytics } from "../firebase/config";

export function pageLogging(pageName) {
  logEvent(appAnalytics, "page_view", { page: pageName });
}

export function clickLogging(itemName) {
  logEvent(appAnalytics, "click", {
    item: itemName,
  });
}

export function clipboardLogging(clipCode, clipAction) {
  logEvent(appAnalytics, "clipboard", {
    code: clipCode,
    action: clipAction ? "Created" : "Joined",
  });
}
