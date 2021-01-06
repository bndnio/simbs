import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import linkResolver from "../utils/linkResolver"
import htmlSerializer from "../utils/htmlSerializer"
import Banner from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    allPrismicAdvocacyPage {
      edges {
        node {
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
              ... on PrismicAdvocacyPageBodyText {
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
              ... on PrismicAdvocacyPageBodyInfoPanel {
                slice_type
                slice_label
                primary {
                  info_title {
                    raw
                  }
                }
                items {
                  info_description {
                    raw
                  }
                  info_image {
                    url
                    alt
                  }
                  info_slogan {
                    raw
                  }
                }
              }
              ... on PrismicAdvocacyPageBodyPullQuote {
                slice_type
                slice_label
                primary {
                  quote {
                    raw
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

// Using the queried Advocacy Page document data, we render the top section
const AdvocacyHead = ({ page }) => {
  return (
    <div className="advocacy-header" data-wio-id={page.id}>
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

export default ({ data }) => {
  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.allPrismicAdvocacyPage.edges.slice(0, 1).pop()

  if (!doc || !doc.node) return null

  return (
    <Layout title="Advocacy">
      <AdvocacyHead page={doc.node} />
      <Slices slices={doc.node.data.body} />
    </Layout>
  )
}
