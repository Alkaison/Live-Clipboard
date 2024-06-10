export function userIdentifier() {
  const storageKey = "user_uuid";

  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie =
      name + "=" + value + ";" + expires + ";path=/;Secure;SameSite=Strict";
  }

  function getOrSetUUID() {
    let uuid = localStorage.getItem(storageKey);

    if (!uuid) {
      uuid = getCookie(storageKey);
    }

    if (!uuid) {
      uuid = generateUUID();
      localStorage.setItem(storageKey, uuid);
      setCookie(storageKey, uuid, 365);
    }

    return uuid;
  }

  // Use or expose the UUID
  const userUUID = getOrSetUUID();
  return userUUID;
}
