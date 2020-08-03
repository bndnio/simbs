import React from "react"
import { RichText } from "prismic-reactjs"
import { linkResolver } from "../../utils/linkResolver"
import htmlSerializer from "../../utils/htmlSerializer"

export default ({ slice }) => (
  <div name={slice.primary.anchor} className="text container reading-block">
    {slice.primary.title && (
      <h2>
        {RichText.render(slice.primary.title, linkResolver, htmlSerializer)}
      </h2>
    )}
    {RichText.render(slice.primary.text, linkResolver, htmlSerializer)}
  </div>
)
