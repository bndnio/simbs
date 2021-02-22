import React from "react"
import { RichText } from "prismic-reactjs"
import { withPreview } from "gatsby-source-prismic"
import { graphql } from "gatsby"
import linkResolver from "../utils/linkResolver"
import htmlSerializer from "../utils/htmlSerializer"
import Banner from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    prismicEventsPage {
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
          ... on PrismicEventsPageBodyText {
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
          ... on PrismicEventsPageBodyTextWithEmbed {
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
              raw_embed {
                raw
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
    <div className="events-header" data-wio-id={page.id}>
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
  const doc = data.prismicEventsPage
  if (!doc) return null

  return (
    <Layout title="Events">
      <EventsHead page={doc} />
      <Slices slices={doc.data.body} />
    </Layout>
  )
})
