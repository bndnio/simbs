import React from "react"
import { PreviewStoreProvider } from "gatsby-source-prismic"

export const wrapRootElement = ({ element }) => (
  <PreviewStoreProvider>{element}</PreviewStoreProvider>
)

const announcementBannerDismissScript = `
(function () {
  var html = document.documentElement;
  var version = html.getAttribute("data-announcement-version");
  if (!version) return;
  try {
    if (sessionStorage.getItem("announcement-banner-dismissed") === version) {
      html.classList.add("announcement-banner-dismissed");
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
