import React from "react"
import { RichText } from "prismic-reactjs"

export default function MediaSlice({ slice }) {
  if (!slice?.primary) return null

  return (
    <div className="media container">
      {/* Optionally render media title */}
      {slice.primary.media_title && (
        <h3 className="media-title">
          {RichText.asText(slice.primary.media_title)}
        </h3>
      )}
      <div
        class="media-embed-wrapper"
        dangerouslySetInnerHTML={{ __html: slice.primary.media_link?.html }}
      />
      {/* Optionally render media caption */}
      {slice.primary.media_caption &&
      RichText.asText(slice.primary.media_caption) !== "" ? (
        <span className="media-caption">
          {RichText.asText(slice.primary.media_caption)}
        </span>
      ) : null}
    </div>
  )
}
