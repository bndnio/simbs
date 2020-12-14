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
    prismic {
      allMembership_pages {
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
              ... on PRISMIC_Membership_pageBodyCta_cards {
                type
                label
                primary {
                  cta_cards_title
                  cta_explainer_text
                }
                fields {
                  card_description
                  cta_background
                  card_title
                  cta_text
                  cta_internal_link
                  cta_link {
                    _linkType
                    ... on PRISMIC__ExternalLink {
                      target
                      _linkType
                      url
                    }
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

// Using the queried Membership Page document data, we render the top section
const MembershipHead = ({ page }) => {
  return (
    <div className="membership-header" data-wio-id={page._meta.id}>
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
  const doc = data.prismic.allMembership_pages.edges.slice(0, 1).pop()

  if (!doc) return null

  return (
    <Layout>
      <MembershipHead page={doc.node} />
      <Slices slices={doc.node.body} />
    </Layout>
  )
}
