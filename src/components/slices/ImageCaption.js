import React from "react"
import { RichText } from "prismic-reactjs"

// Default Image
function DefaultImage({ slice }) {
  if (!slice?.primary) return null

  return (
    <div className="post-image">
      <figcaption className="block-img">
        <img src={slice.primary.image?.url} alt={slice.primary.image?.alt} />
        {slice.primary.caption &&
        RichText.asText(slice.primary.caption) !== "" ? (
          <figcaption className="image-label">
            {RichText.asText(slice.primary.caption)}
          </figcaption>
        ) : null}
      </figcaption>
    </div>
  )
}

// Emphasized Image
function EmphasizedImage({ slice }) {
  if (!slice?.primary) return null

  return (
    <div className="post-image">
      <figcaption className="block-img emphasized">
        <img src={slice.primary.image?.url} alt={slice.primary.image?.alt} />
        {slice.primary.caption &&
        RichText.asText(slice.primary.caption) !== "" ? (
          <figcaption className="image-label">
            {RichText.asText(slice.primary.caption)}
          </figcaption>
        ) : null}
      </figcaption>
    </div>
  )
}

// Full Width Image
function FullWidthImage({ slice }) {
  if (!slice?.primary) return null

  return (
    <div
      className="post-image full-width-image"
      style={{ backgroundImage: "url(" + slice.primary.image?.url + ")" }}
    >
      <div className="wrapper">
        {slice.primary.caption &&
        RichText.asText(slice.primary.caption) !== "" ? (
          <span className="image-label">
            {RichText.asText(slice.primary.caption)}
          </span>
        ) : null}
      </div>
    </div>
  )
}

// Function to determine the image type
const renderSwitch = function (slice) {
  switch (slice.label) {
    case "image-full-width":
      return <FullWidthImage slice={slice} />
    case "emphasized":
      return <EmphasizedImage slice={slice} />
    default:
      return <DefaultImage slice={slice} />
  }
}

export default ({ slice }) => {
  if (!slice.primary.image) return null
  return renderSwitch(slice)
}
