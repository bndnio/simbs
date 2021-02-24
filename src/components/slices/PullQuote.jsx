import React from "react"
import { RichText } from "prismic-reactjs"

export default function PullQuote({ slice }) {
  if (!slice?.primary) return null

  return (
    <div className="container pull-quote">
      <blockquote>{RichText.asText(slice.primary.quote.raw)}</blockquote>
    </div>
  )
}
