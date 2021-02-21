chrome.runtime.onMessage.addListener(function (message, _sender, sendResponse) {
  console.log(message)
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
  }
});

function changeResponseHeaders(details) {
  if (details.responseHeaders.length > 0) {
    for (let i = details.responseHeaders.length - 1; i >= 0; --i) {
      let header = details.responseHeaders[i];
      console.log("Header", i, header.name);
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
    return { responseHeaders: details.responseHeaders };
  }
}
