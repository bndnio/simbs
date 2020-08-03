import React from "react"
import { RichText } from "prismic-reactjs"

export default ({ slice }) => (
  <div className="cta reading-block">
    <a
      className="cta-button"
      target={slice.primary.cta_link.target}
      rel="noopener"
      href={slice.primary.cta_link.url}
    >
      {RichText.asText(slice.primary.cta_title)}
    </a>
  </div>
)
