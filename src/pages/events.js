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
    allPrismicEventsPage {
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
              ... on PrismicEventsPageBodyText {
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
              ... on PrismicEventsPageBodyTextWithEmbed {
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
                  raw_embed {
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

// Using the queried Events Page document data, we render the top section
const EventsHead = ({ page }) => {
  return (
    <div className="events-header" data-wio-id={page._meta.id}>
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
  const doc = data.prismic.allEvents_pages.edges.slice(0, 1).pop()

  if (!doc || !doc.node) return null

  return (
    <Layout title="Events">
      <EventsHead page={doc.node} />
      <Slices slices={doc.node.body} />
    </Layout>
  )
}
