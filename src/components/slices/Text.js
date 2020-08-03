import React from "react"
import { RichText } from "prismic-reactjs"
import { linkResolver } from "../../utils/linkResolver"
import htmlSerializer from "../../utils/htmlSerializer"

export default ({ slice }) => (
  <div name={slice.primary.anchor} className="post-text reading-block">
    {slice.primary.text_title && (
      <h2>
        {RichText.render(
          slice.primary.text_title,
          linkResolver,
          htmlSerializer
        )}
      </h2>
    )}
    {RichText.render(slice.primary.text, linkResolver, htmlSerializer)}
  </div>
)
