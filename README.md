# FoundryVTT Inline Webviewer Extension

This browser extension allows for circumventing x-frame-options within the [Inline Webviewer module](https://github.com/ardittristan/VTTInlineWebviewer).

It does the following:

- Drop all `x-frame-options` response headers
- Drop all `content-security-policy` response headers
- Change all `set-cookie` response headers to set `SameSite=None` (this also requires the `Secure` flag to be set for the cookie)

Note, that when cookies within this iframe are required, the iframe content has to be HTTPS, otherwise cookies will not be set.

## Installation

1. Download the crx file from the [Releases](/releases) tab.

2. Go to [chrome://extensions](chrome://extensions) in your browser.

3. Enable Developer mode (usually top right).

4. Drag crx file onto the extensions page.

5. Accept extension install.
