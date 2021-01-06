import React from "react"
import { RichText } from "prismic-reactjs"
import linkResolver from "../../utils/linkResolver"
import htmlSerializer from "../../utils/htmlSerializer"

export default function Text({ slice }) {
  if (!slice.primary) return null

  return (
    <div id={slice.primary.anchor} className="text container">
      {/* Render text section title if present */}
      {slice.primary.title && (
        <header>
          {RichText.render(
            slice.primary.title.raw,
            linkResolver,
            htmlSerializer
          )}
        </header>
      )}
      {/* Render embedded code if present */}
      {slice.primary.raw_embed && (
        <div
          dangerouslySetInnerHTML={{
            __html: RichText.asText(slice.primary.raw_embed.raw),
          }}
        />
      )}
      {/* Render text body */}
      {RichText.render(slice.primary.text.raw, linkResolver, htmlSerializer)}
    </div>
  )
}
