import React from "react"
import { RichText } from "prismic-reactjs"
import { withPreview } from "gatsby-source-prismic"
import { graphql } from "gatsby"
import Banner from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"
import linkResolver from "../utils/linkResolver"
import htmlSerializer from "../utils/htmlSerializer"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    prismicMembershipPage {
      id
      data {
        title {
          raw
        }
        subtitle {
          raw
        }
        image {
          url
          alt
        }
        description {
          raw
        }
        body {
          ... on PrismicMembershipPageBodyText {
            slice_type
            slice_label
            primary {
              anchor
              text {
                raw
              }
              title {
                raw
              }
            }
          }
          ... on PrismicMembershipPageBodyMedia {
            slice_type
            slice_label
            primary {
              media_caption {
                raw
              }
              media_link {
                type
                embed_url
              }
              media_title {
                raw
              }
            }
          }
          ... on PrismicMembershipPageBodyCtaCards {
            slice_type
            slice_label
            primary {
              cta_cards_title {
                raw
              }
              cta_explainer_text {
                raw
              }
            }
            items {
              card_description {
                raw
              }
              cta_background {
                url
                alt
              }
              card_title {
                raw
              }
              cta_text {
                raw
              }
              cta_internal_link
              cta_link {
                link_type
                target
                url
              }
            }
          }
        }
      }
    }
  }
`

// Using the queried Membership Page document data, we render the top section
const MembershipHead = ({ page }) => {
  return (
    <div className="membership-header" data-wio-id={page.id}>
      <Banner
        url={page.data.image?.url}
        title={page.data.title && RichText.asText(page.data.title.raw)}
        subtitle={page.data.subtitle && RichText.asText(page.data.subtitle.raw)}
      />

      {page.data.description && (
        <div className="container">
          {RichText.render(
            page.data.description.raw,
            linkResolver,
            htmlSerializer
          )}
        </div>
      )}
    </div>
  )
}

export default withPreview(({ data }) => {
  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.prismicMembershipPage
  if (!doc) return null

  return (
    <Layout title="Membership">
      <MembershipHead page={doc} />
      <Slices slices={doc.data.body} />
    </Layout>
  )
})
