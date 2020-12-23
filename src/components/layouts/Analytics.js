import React from "react"

export default function Analytics(props) {
  const ID = "G-78BK1EHYQY"

  function gtag() {
    window.dataLayer.push(arguments)
  }

  React.useEffect(() => {
    window.dataLayer = window.dataLayer || []
    gtag("js", new Date())
    gtag("config", ID)
  }, [])

  return (
    <>
      {/* Global site tag (gtag.js) - Google Analytics */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${ID}`}
      ></script>
      {/* On load, trigger setup with useEffect above */}
      {/* END Global site tag (gtag.js) - Google Analytics */}
    </>
  )
}
