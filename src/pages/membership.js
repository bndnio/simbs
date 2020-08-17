import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import { linkResolver } from "../utils/linkResolver"
import htmlSerializer from "../utils/htmlSerializer"
import Layout from "../components/layouts"
import { Text, Media } from "../components/slices"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    prismic {
      allMembership_pages {
        edges {
          node {
            _meta {
              id
            }
            page_title
            body {
              ... on PRISMIC_Membership_pageBodyText {
                type
                label
                primary {
                  anchor
                  text
                  title
                }
              }
              ... on PRISMIC_Membership_pageBodyMedia {
                type
                label
                primary {
                  media_caption
                  media_link
                  media_title
                }
              }
            }
          }
        }
      }
    }
  }
`

// Using the queried Membership Page document data, we render the top section
const MembershipHead = ({ page }) => {
  return (
    <div className="membership-header container" data-wio-id={page._meta.id}>
      {/* Render Membership page */}
      {page.page_title && <h1>{RichText.asText(page.page_title)}</h1>}
    </div>
  )
}

// Sort and display the different slice options
const MembershipSlices = ({ slices }) => {
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

        case "media":
          return (
            <div key={index} className="homepage-slice-wrapper">
              {<Media slice={slice} />}
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
  const doc = data.prismic.allMembership_pages.edges.slice(0, 1).pop()

  if (!doc) return null

  return (
    <Layout>
      <MembershipHead page={doc.node} />
      <MembershipSlices slices={doc.node.body} />
    </Layout>
  )
}
