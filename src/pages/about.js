import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import Banner from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    prismic {
      allAbout_pages {
        edges {
          node {
            _meta {
              id
            }
            title
            subtitle
            image
            description
            body {
              ... on PRISMIC_About_pageBodyText {
                type
                label
                primary {
                  anchor
                  text
                  title
                }
              }
              ... on PRISMIC_About_pageBodyTeam {
                type
                label
                primary {
                  team_section
                }
                fields {
                  position
                  portrait
                  first_and_lastname
                  description
                  email
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

  if (!doc) return null

  return (
    <Layout>
      <AboutHead page={doc.node} />
      <Slices slices={doc.node.body} />
    </Layout>
  )
}
