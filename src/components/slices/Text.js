import React from "react"
import { RichText } from "prismic-reactjs"
import { linkResolver } from "../../utils/linkResolver"
import htmlSerializer from "../../utils/htmlSerializer"

export default ({ slice }) => (
  <div name={slice.primary.anchor} className="text container">
    {/* Render text section title */}
    {slice.primary.title && <h2>{RichText.asText(slice.primary.title)}</h2>}
    {/* Render text body */}
    {RichText.render(slice.primary.text, linkResolver, htmlSerializer)}
  </div>
)
