import React from "react"

const ID = "G-78BK1EHYQY"

export default function Analytics(props) {
  React.useEffect(() => {
    window.dataLayer = window.dataLayer || []
    gtag("js", new Date())
    gtag("config", ID)
  }, [])

  return props.children || null
}

export function gtag() {
  if (!window.dataLayer) {
    console.error("Google Analytics not setup")
    return null
  }

  window.dataLayer.push(arguments)
}

// Global site tag (gtag.js) - Google Analytics
export const tagManagerScript = (
  <script
    async
    src={`https://www.googletagmanager.com/gtag/js?id=${ID}`}
  ></script>
)
