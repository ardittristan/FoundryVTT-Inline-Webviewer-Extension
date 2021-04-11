chrome.devtools.network.onRequestFinished.addListener((req) => {
  chrome.runtime.sendMessage({
    devtool: true,
    message: req,
    url: req.request.url,
    tabId: chrome.devtools.inspectedWindow.tabId,
  });
});
