import React from "react"
import { PreviewStoreProvider } from "gatsby-source-prismic"

export const wrapRootElement = ({ element }) => (
  <PreviewStoreProvider>{element}</PreviewStoreProvider>
)

const announcementBannerDismissScript = `
(function () {
  var chrome = document.querySelector(".site-chrome[data-announcement-version]");
  if (!chrome) return;
  var version = chrome.getAttribute("data-announcement-version");
  try {
    if (sessionStorage.getItem("announcement-banner-dismissed") === version) {
      chrome.classList.add("site-chrome--banner-dismissed");
    }
  } catch (e) {}
})();
`

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="announcement-banner-dismiss"
      dangerouslySetInnerHTML={{ __html: announcementBannerDismissScript }}
    />,
  ])
}
