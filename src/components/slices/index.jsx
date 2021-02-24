import React from "react"
import CTA from "./CTA"
import CTACards from "./CTACards"
import ImageCaption from "./ImageCaption"
import InfoPanel from "./InfoPanel"
import Media from "./Media"
import PullQuote from "./PullQuote"
import Team from "./Team"
import Text from "./Text"

export { CTA, ImageCaption, Media, PullQuote, Team, Text }

// Sort and display the different slice options
export default function Slices({ slices }) {
  if (!slices) return null

  return slices.map((slice, index) => {
    const res = (() => {
      switch (slice.slice_type) {
        case "call_to_action":
          return <section key={index}>{<CTA slice={slice} />}</section>

        case "cta_cards":
          return <section key={index}>{<CTACards slice={slice} />}</section>

        case "image_with_caption":
          return <section key={index}>{<ImageCaption slice={slice} />}</section>

        case "info_panel":
          return <section key={index}>{<InfoPanel slice={slice} />}</section>

        case "media":
          return <section key={index}>{<Media slice={slice} />}</section>

        case "pull_quote":
          return <section key={index}>{<PullQuote slice={slice} />}</section>

        case "team":
          return <section key={index}>{<Team slice={slice} />}</section>

        case "text":
        case "text_with_embed":
          return <section key={index}>{<Text slice={slice} />}</section>

        default:
          return
      }
    })()
    return res
  })
}
