import React from "react"
import { RichText } from "prismic-reactjs"

export default function MediaSlice({ slice }) {
  return (
    <div className="media">
      {/* Optionally render media title */}
      {slice.primary.media_title && (
        <h3 className="media-title">
          {RichText.asText(slice.primary.media_title)}
        </h3>
      )}
      <div
        dangerouslySetInnerHTML={{ __html: slice.primary.media_link.html }}
      />
      {/* Optionally render media caption */}
      {slice.primary.caption &&
      RichText.asText(slice.primary.caption) !== "" ? (
        <span className="media-caption">
          {RichText.asText(slice.primary.caption)}
        </span>
      ) : null}
    </div>
  )
}
