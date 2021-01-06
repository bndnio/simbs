import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import Banner from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"
import { linkResolver } from "../utils/linkResolver"
import htmlSerializer from "../utils/htmlSerializer"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    allPrismicMembershipPage {
      edges {
        node {
          id
          data {
            title {
              html
              text
            }
            subtitle {
              html
              text
            }
            image {
              url
              alt
            }
            description {
              html
              text
            }
            body {
              ... on PrismicMembershipPageBodyText {
                slice_type
                slice_label
                primary {
                  anchor
                  text {
                    html
                    text
                  }
                  title {
                    html
                    text
                  }
                }
              }
              ... on PrismicMembershipPageBodyMedia {
                slice_type
                slice_label
                primary {
                  media_caption {
                    html
                    text
                  }
                  media_link {
                    type
                    embed_url
                  }
                  media_title {
                    html
                    text
                  }
                }
              }
              ... on PrismicMembershipPageBodyCtaCards {
                slice_type
                slice_label
                primary {
                  cta_cards_title {
                    html
                    text
                  }
                  cta_explainer_text {
                    html
                    text
                  }
                }
                items {
                  card_description {
                    html
                    text
                  }
                  cta_background {
                    url
                    alt
                  }
                  card_title {
                    html
                    text
                  }
                  cta_text {
                    html
                    text
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
    }
  }
`

// Using the queried Membership Page document data, we render the top section
const MembershipHead = ({ page }) => {
  return (
    <div className="membership-header" data-wio-id={page._meta.id}>
      <Banner
        url={page.image?.url}
        title={page.title && RichText.asText(page.title)}
        subtitle={page.subtitle && RichText.asText(page.subtitle)}
      />

      {page.description && (
        <div className="container">
          {RichText.render(page.description, linkResolver, htmlSerializer)}
        </div>
      )}
    </div>
  )
}

export default ({ data }) => {
  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.prismic.allMembership_pages.edges.slice(0, 1).pop()

  if (!doc || !doc.node) return null

  return (
    <Layout title="Membership">
      <MembershipHead page={doc.node} />
      <Slices slices={doc.node.body} />
    </Layout>
  )
}
