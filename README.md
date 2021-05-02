# FoundryVTT Inline Webviewer Extension

This browser extension allows for circumventing x-frame-options within the [Inline Webviewer module](https://github.com/ardittristan/VTTInlineWebviewer).

It does the following:

- Drop all `x-frame-options` response headers
- Drop all `content-security-policy` response headers
- Change all `set-cookie` response headers to set `SameSite=None` (this also requires the `Secure` flag to be set for the cookie)

Note, that when cookies within this iframe are required, the iframe content has to be HTTPS, otherwise cookies will not be set.

## Special websites

<details open>

| Site                        | Login Issues                                | Third Party Login Issues   | Other Issues |
| --------------------------- | ------------------------------------------- | -------------------------- | ------------ |
| <https://www.dndbeyond.com> | Requires devtools to be open when logged in |                            |              |
| <https://www.notion.so>     | Requires devtools to be open when logged in | Google login does not work |              |

<details>

  <summary>Help! A website that isn't in the list isn't functioning!</summary>

#### Here's a few things you can try

1. Try using a different login method.
2. Try logging in with devtools open.
3. Try logging in in a different tab and check if you're logged in in the webview.
4. Try figuring out what cookie stores the login data and add it's name and site to the [brokenCookies.json](https://github.com/ardittristan/FoundryVTT-Inline-Webviewer-Extension/blob/master/api/brokenCookies.json) file in a pull request.
5. If you don't know how to do 4, make an issue with the affected site.

  </details>

</details>

## Installation

### Method 1

1. Download the crx file from the [Releases](https://github.com/ardittristan/FoundryVTT-Inline-Webviewer-Extension/releases) tab.

2. Go to <chrome://extensions> in your browser.

3. Enable Developer mode (usually top right).

4. Drag crx file onto the extensions page.

5. Accept extension install.

### Method 2

1. Download the zip file from the [Releases](https://github.com/ardittristan/FoundryVTT-Inline-Webviewer-Extension/releases) tab.

2. Unzip the file to a folder somewhere (this folder will be permanent, so don't remove it after installing).

3. Go to <chrome://extensions> in your browser.

4. Enable Developer mode (usually top right).

5. Click on the `Load unpacked` button and select the folder you made before.

6. The extension should now be installed
