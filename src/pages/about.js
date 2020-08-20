import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import Layout from "../components/layouts"
import { Team, Text } from "../components/slices"

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
            about_page_title
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
    <div className="about-header container " data-wio-id={page._meta.id}>
      {/* Render About page */}
      {page.about_page_title && (
        <h1>{RichText.asText(page.about_page_title)}</h1>
      )}
    </div>
  )
}

// Sort and display the different slice options
const AboutSlices = ({ slices }) => {
  if (!slices) return null

  return slices.map((slice, index) => {
    const res = (() => {
      switch (slice.type) {
        case "text":
          return (
            <div key={index} className="homepage-slice-wrapper">
              {<Text slice={slice} />}
            </div>
          )

        case "team":
          return (
            <div key={index} className="homepage-slice-wrapper">
              {<Team slice={slice} />}
            </div>
          )

        default:
          return
      }
    })()
    return res
  })
}

export default ({ data }) => {
  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.prismic.allAbout_pages.edges.slice(0, 1).pop()

  if (!doc) return null

  return (
    <Layout>
      <AboutHead page={doc.node} />
      <AboutSlices slices={doc.node.body} />
    </Layout>
  )
}
