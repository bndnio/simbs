import React from "react"
import { RichText } from "prismic-reactjs"

export default function CTA({ slice }) {
  if (!slice?.primary) return null

  const hasLink = slice.primary.cta_link?.url

  return (
    <div className="cta container">
      <a
        className={`cta-button btn btn-lg ${hasLink ? "" : "disabled"}`}
        target={slice.primary.cta_link?.target}
        rel="noopener"
        href={slice.primary.cta_link?.url}
      >
        {RichText.asText(slice.primary.cta_title.raw)}
      </a>
    </div>
  )
}
