import React from "react"
import { RichText } from "prismic-reactjs"
import { linkResolver } from "../../utils/linkResolver"
import htmlSerializer from "../../utils/htmlSerializer"

function InfoImage({ image }) {
  if (!image) return <div className="image-placeholder" />

  return <img src={image.url} alt={image.alt} />
}

function InfoSection({ section, opposite }) {
  if (!section) return null
  return (
    <div className={`info-section ${opposite ? "opposite" : ""}`}>
      <InfoImage image={section.info_image} />
      <div className="info-content">
        {RichText.render(section.info_slogan, linkResolver, htmlSerializer)}
        {RichText.render(
          section.info_description,
          linkResolver,
          htmlSerializer
        )}
      </div>
    </div>
  )
}

export default function InfoPanel({ slice }) {
  const infoSections = slice?.fields || []
  if (!infoSections.length) return null

  return (
    <div className="info-panel-wrapper">
      <div className="info-panel container">
        {RichText.render(slice.info_title, linkResolver, htmlSerializer)}
        {infoSections.map((section, i) => (
          <InfoSection section={section} opposite={i % 2} key={i} />
        ))}
      </div>
    </div>
  )
}
