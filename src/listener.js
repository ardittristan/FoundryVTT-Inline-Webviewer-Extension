let filteredIframes = [];
const observer = new MutationObserver(function () {
  let newFilteredIframes = [];
  document.querySelectorAll("iframe").forEach((el) => {
    if (filteredIframes.includes(el.id)) {
      if (!newFilteredIframes.includes(el.id)) {
        newFilteredIframes.push(el.id);
      }
    } else {
      filteredIframes.push(el.id);
      newFilteredIframes.push(el.id);
      let src = el.attributes.getNamedItem("fakesrc")?.value;
      if (src?.length > 0) {
        console.log(src);
        chrome.runtime.sendMessage({ frameSrc: src }, function () {
          document.getElementById(el.id).src = src;
        });
      }
    }
  });
  filteredIframes = newFilteredIframes;
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

function start() {
  if (window.localStorage?.isFoundry === "true") {
    chrome.runtime.sendMessage({ active: true });

    let el = document.createElement("script");
    el.innerHTML = `
window.hasIframeCompatibility = true;
window.inlineWebviewerExtensionVersion = ${chrome.runtime.getManifest().version}
`;
    document.head.appendChild(el);

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });
  }
}
