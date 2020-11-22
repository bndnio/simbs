import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import { BannerBG } from "../components/Banner"
import Layout from "../components/layouts"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    prismic {
      allHome_pages {
        edges {
          node {
            _meta {
              id
              uid
              type
            }
            cta_link {
              ... on PRISMIC__ExternalLink {
                target
                _linkType
                url
              }
            }
            subtitle
            cta_text
            title
            banner
            banner_overlay
          }
        }
      }
      allPosts(sortBy: date_DESC) {
        edges {
          node {
            _meta {
              id
              uid
              type
            }
            title
            date
            body {
              ... on PRISMIC_PostBodyText {
                type
                label
                primary {
                  anchor
                  title
                  text
                }
              }
            }
          }
        }
      }
    }
  }
`

// Using the queried Blog Home document data, we render the top section
const BlogHomeHead = ({ home }) => {
  return (
    <div className="home-header" data-wio-id={home._meta.id}>
      <BannerBG hero url={home.banner.url}>
        <div className="banner-content">
          <div className="banner-content-col">
            <img className="simbs-crest" src={home.banner_overlay.url} />
          </div>
          <div className="banner-content-col">
            <h1 className="banner-title">{RichText.asText(home.title)}</h1>
            <h2 className="banner-subtitle">
              {RichText.asText(home.subtitle)}
            </h2>
            <a className="home-cta link" href={home.cta_link?.url}>
              {RichText.asText(home.cta_text)}
            </a>
          </div>
        </div>
      </BannerBG>
    </div>
  )
}

export default ({ data }) => {
  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.prismic.allHome_pages.edges.slice(0, 1).pop()

  if (!doc) return null

  return (
    <Layout clearNav>
      <BlogHomeHead home={doc.node} />
    </Layout>
  )
}
