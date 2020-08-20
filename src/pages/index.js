import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import Layout from "../components/layouts"
import BlogPosts from "../components/BlogPosts"

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
  const banner = { backgroundImage: "url(" + home.banner.url + ")" }
  return (
    <div className="home-header container" data-wio-id={home._meta.id}>
      <img src={home.banner.url}></img>
      <div className="home-banner" style={banner}></div>
      <h1>{RichText.asText(home.title)}</h1>
      <h2>{RichText.asText(home.subtitle)}</h2>
      <a className="home-cta link" href={home.cta_link?.url}>
        {RichText.asText(home.cta_text)}
      </a>
    </div>
  )
}

export default ({ data }) => {
  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.prismic.allHome_pages.edges.slice(0, 1).pop()

  if (!doc) return null

  return (
    <Layout>
      <BlogHomeHead home={doc.node} />
    </Layout>
  )
}
