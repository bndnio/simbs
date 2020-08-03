import React from "react"
import { RichText } from "prismic-reactjs"

export default ({ slice }) => (
  <div className="pull-quote reading-block">
    <blockquote>{RichText.asText(slice.primary.quote)}</blockquote>
  </div>
)
