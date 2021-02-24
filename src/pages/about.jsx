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
    prismicAboutPage {
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
          ... on PrismicAboutPageBodyText {
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
          ... on PrismicAboutPageBodyTeam {
            slice_type
            slice_label
            primary {
              team_section {
                raw
              }
            }
            items {
              position {
                raw
              }
              portrait {
                url
                alt
              }
              first_and_lastname {
                raw
              }
              description {
                raw
              }
              email
            }
          }
          ... on PrismicAboutPageBodyInfoPanel {
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
        }
      }
    }
  }
`

// Using the queried About Page document data, we render the top section
const AboutHead = ({ page }) => {
  return (
    <div className="about-header" data-wio-id={page.id}>
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
  const doc = data.prismicAboutPage
  if (!doc) return null

  return (
    <Layout title="About">
      <AboutHead page={doc} />
      <Slices slices={doc.data.body} />
    </Layout>
  )
})
