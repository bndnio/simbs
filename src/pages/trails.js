import React from "react"
import { RichText } from "prismic-reactjs"
import { withPreview } from "gatsby-source-prismic"
import { graphql } from "gatsby"
import { linkResolver } from "../utils/linkResolver"
import htmlSerializer from "../utils/htmlSerializer"
import Banner from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    allPrismicTrailsPage {
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
              ... on PrismicTrailsPageBodyText {
                slice_type
                slice_label
                primary {
                  anchor
                  text {
                    raw
                    html
                  }
                  title {
                    raw
                  }
                }
              }
              ... on PrismicTrailsPageBodyTextWithEmbed {
                slice_type
                slice_label
                primary {
                  anchor
                  text {
                    raw
                    html
                  }
                  title {
                    raw
                  }
                  raw_embed {
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

// Using the queried Trails Page document data, we render the top section
const TrailsHead = ({ page }) => {
  return (
    <div className="trails-header" data-wio-id={page.id}>
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
  const doc = data.allPrismicTrailsPage.edges.slice(0, 1).pop()

  if (!doc || !doc.node) return null

  return (
    <Layout title="Trails">
      <TrailsHead page={doc.node} />
      <Slices slices={doc.node.data.body} />
    </Layout>
  )
})
