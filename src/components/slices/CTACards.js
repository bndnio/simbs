import React from "react"
import { RichText } from "prismic-reactjs"
import linkResolver from "../../utils/linkResolver"
import htmlSerializer from "../../utils/htmlSerializer"

function CTACard({ card }) {
  if (!card) return null

  const ctaBGOpacity = 0.2
  const ctaBG = card.cta_background?.url
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, ${ctaBGOpacity}), rgba(0, 0, 0, ${ctaBGOpacity})), url('${card.cta_background.url}')`,
      }
    : {}

  const url = card.cta_internal_link || card.cta_link?.target

  return (
    <a
      className="card-wrapper"
      target={card.cta_link?.target || ""}
      rel="noopener"
      href={url}
    >
      <div
        className={`card cta-card ${card.cta_background?.url ? "invert" : ""}`}
        style={ctaBG}
      >
        <div className="card-top">
          <h3>{RichText.asText(card.card_title.raw)}</h3>
          {card.card_description &&
            RichText.asText(card.card_description.raw) && (
              <span className="h5">
                {RichText.asText(card.card_description.raw)}
              </span>
            )}
        </div>
        {card.cta_text && RichText.asText(card.cta_text.raw) && (
          <span className="btn">{RichText.asText(card.cta_text.raw)}</span>
        )}
      </div>
    </a>
  )
}

export default function CTACards({ slice }) {
  if (!slice.primary || !slice.items.length) return null

  return (
    <div className="container">
      {RichText.render(
        slice.primary.cta_cards_title.raw,
        linkResolver,
        htmlSerializer
      )}
      <div className="cta-cards">
        {slice.items.map((ctaCard, i) => (
          <CTACard card={ctaCard} key={i} />
        ))}
      </div>
      {RichText.render(
        slice.primary.cta_explainer_text.raw,
        linkResolver,
        htmlSerializer
      )}
    </div>
  )
}
