import React from "react"
import { RichText } from "prismic-reactjs"

export default function CTA({ slice }) {
  if (!slice?.primary) return null

  return (
    <section className="cta">
      <a
        className="cta-button btn btn-lg"
        target={slice.primary.cta_link?.target}
        rel="noopener"
        href={slice.primary.cta_link?.url}
      >
        {RichText.asText(slice.primary.cta_title)}
      </a>
    </section>
  )
}
