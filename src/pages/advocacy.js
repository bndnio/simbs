import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import { linkResolver } from "../utils/linkResolver"
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
              ... on PrismicAdvocacyPageBodyText {
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
              ... on PrismicAdvocacyPageBodyInfoPanel {
                slice_type
                slice_label
                primary {
                  info_title {
                    html
                    text
                  }
                }
                items {
                  info_description {
                    html
                    text
                  }
                  info_image {
                    url
                    alt
                  }
                  info_slogan {
                    html
                    text
                  }
                }
              }
              ... on PrismicAdvocacyPageBodyPullQuote {
                slice_type
                slice_label
                primary {
                  quote {
                    html
                    text
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
    <div className="advocacy-header" data-wio-id={page._meta.id}>
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
  const doc = data.prismic.allAdvocacy_pages.edges.slice(0, 1).pop()

  if (!doc || !doc.node) return null

  return (
    <Layout title="Advocacy">
      <AdvocacyHead page={doc.node} />
      <Slices slices={doc.node.body} />
    </Layout>
  )
}
