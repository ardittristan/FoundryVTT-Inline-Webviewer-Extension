let tabId;
let brokenCookies;
console.log(document);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.devtool) {
    if (message.tabId === tabId) {
      /** @type {chrome.devtools.network.Request} */
      let req = message.message;

      filterCookies(req.response.cookies);
    }
    return;
  }
  console.log(message);

  if (message.frameSrc) {
    /** @type {String} */
    let src = message.frameSrc;
    let root = src.match(/https?:\/\/[^\/]+/)?.[0];
    chrome.browsingData.remove(
      {
        origins: [root],
      },
      {
        serviceWorkers: true,
      }
    );
    sendResponse(true);
  }

  if (message.active) {
    tabId = sender.tab?.id || undefined;
    (async () => {
      brokenCookies = await (
        await fetch("https://raw.githubusercontent.com/ardittristan/FoundryVTT-Inline-Webviewer-Extension/master/api/brokenCookies.json", { cache: "reload" })
      ).json();
      console.log("fetched broken cookies\n", { brokenCookies });

      chrome.cookies.getAll({}, filterCookies);
    })();
    try {
      chrome.webRequest.onHeadersReceived.addListener(
        changeResponseHeaders,
        {
          urls: ["<all_urls>"],
          types: ["sub_frame"],
        },
        ["blocking", "responseHeaders", chrome.webRequest.OnHeadersReceivedOptions.EXTRA_HEADERS].filter(Boolean)
      );
    } catch (e) {
      chrome.webRequest.onHeadersReceived.addListener(
        changeResponseHeaders,
        {
          urls: ["<all_urls>"],
        },
        ["blocking", "responseHeaders"]
      );
    }

    chrome.cookies.onChanged.addListener((changeInfo) => {
      if (!changeInfo.removed && (changeInfo.cookie.sameSite !== "no_restriction" || !changeInfo.cookie.secure)) {
        brokenCookies.forEach((brokenCookie) => {
          if (changeInfo.cookie.name === brokenCookie[0] && changeInfo.cookie.domain === brokenCookie[1]) setCookie(changeInfo.cookie);
        });
      }
    });
  }
});

/** @param  {chrome.webRequest.WebResponseHeadersDetails} details */
function changeResponseHeaders(details) {
  if (details.responseHeaders.length > 0 && details.tabId == tabId) {
    let headers = [];
    for (let i = details.responseHeaders.length - 1; i >= 0; --i) {
      let header = details.responseHeaders[i];
      headers.push(header.name);
      if (header.name.toLowerCase() === "x-frame-options" || header.name.toLowerCase() === "content-security-policy") {
        details.responseHeaders.splice(i, 1);
      } else if (header.name.toLowerCase() === "set-cookie") {
        if (header.value.match(/;\s*[Ss]ame[Ss]ite=/)) {
          header.value.replace(/;\s*[Ss]ame[Ss]ite=[^;]*/, "; SameSite=None");
        } else {
          header.value += "; SameSite=None";
        }
        if (!header.value.match(/;\s*[Ss]ecure/)) {
          header.value += "; Secure";
        }
      }
    }
    console.log("Headers", headers);
    return { responseHeaders: details.responseHeaders };
  }
}

/** @param  {chrome.cookies.Cookie} cookie */
function setCookie(cookie) {
  console.log("changing cookie", cookie);
  chrome.cookies.set({
    url: "https://" + (cookie.domain.startsWith(".") ? cookie.domain.slice(1) : cookie.domain) + cookie.path,
    domain: cookie.domain,
    expirationDate: cookie.expirationDate,
    httpOnly: cookie.httpOnly,
    name: cookie.name,
    path: cookie.path,
    sameSite: "no_restriction",
    secure: true,
    value: cookie.value,
  });
}

/** @param  {chrome.cookies.Cookie[]} cookies */
function filterCookies(cookies) {
  cookies.forEach((cookie) => {
    if (cookie.sameSite !== "no_restriction" || !cookie.secure) {
      brokenCookies.forEach((brokenCookie) => {
        if (cookie.name === brokenCookie[0] && cookie.domain === brokenCookie[1]) setCookie(cookie);
      });
    }
  });
}
