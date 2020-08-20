import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import { linkResolver } from "../utils/linkResolver"
import htmlSerializer from "../utils/htmlSerializer"
import Layout from "../components/layouts"
import Slices from "../components/slices"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    prismic {
      allAdvocacy_pages {
        edges {
          node {
            _meta {
              id
            }
            title
            description
            body {
              ... on PRISMIC_Advocacy_pageBodyText {
                type
                label
                primary {
                  anchor
                  text
                  title
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
    <div className="advocacy-header container" data-wio-id={page._meta.id}>
      {/* Render Advocacy page */}
      {page.title && <h1>{RichText.asText(page.title)}</h1>}
      {page.description &&
        RichText.render(page.description, linkResolver, htmlSerializer)}
    </div>
  )
}

export default ({ data }) => {
  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.prismic.allAdvocacy_pages.edges.slice(0, 1).pop()

  if (!doc) return null

  return (
    <Layout>
      <AdvocacyHead page={doc.node} />
      <Slices slices={doc.node.body} />
    </Layout>
  )
}
