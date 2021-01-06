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
    allPrismicAboutPage {
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
              ... on PrismicAboutPageBodyText {
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
              ... on PrismicAboutPageBodyTeam {
                slice_type
                slice_label
                primary {
                  team_section {
                    html
                    text
                  }
                }
                items {
                  position {
                    html
                    text
                  }
                  portrait {
                    url
                    alt
                  }
                  first_and_lastname {
                    html
                    text
                  }
                  description {
                    html
                    text
                  }
                  email
                }
              }
              ... on PrismicAboutPageBodyInfoPanel {
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
    <div className="about-header" data-wio-id={page._meta.id}>
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
  const doc = data.prismic.allAbout_pages.edges.slice(0, 1).pop()

  if (!doc || !doc.node) return null

  return (
    <Layout title="About">
      <AboutHead page={doc.node} />
      <Slices slices={doc.node.body} />
    </Layout>
  )
}
