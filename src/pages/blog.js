import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import Layout from "../components/layouts"
import BlogPosts from "../components/BlogPosts"
import Categories from "../components/Categories"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    prismic {
      allBlog_homes(uid: null) {
        edges {
          node {
            _meta {
              id
              type
            }
            headline
            description
            image
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
            author
            date
            thumbnail
            categories {
              category {
                ... on PRISMIC_Blog_post_category {
                  _meta {
                    uid
                  }
                  name
                }
              }
            }
            body {
              ... on PRISMIC_PostBodyText {
                type
                label
                primary {
                  text
                }
              }
            }
          }
        }
      }
      allBlog_post_categorys {
        edges {
          node {
            _meta {
              uid
            }
            name
            description
          }
        }
      }
    }
  }
`

// Using the queried Blog Home document data, we render the top section
const BlogHomeHead = ({ home, categories }) => {
  const banner = { backgroundImage: "url(" + home.image.url + ")" }
  return (
    <div className="blog-header container" data-wio-id={home._meta.id}>
      {/* <div className="blog-banner-bg" style={banner}> */}
      <div className="blog-banner-text">
        <h1>{RichText.asText(home.headline)}</h1>
        <p className="blog-description">{RichText.asText(home.description)}</p>
      </div>
      <Categories categories={categories} displayAll enableToggle />
      {/* </div> */}
    </div>
  )
}

export default ({ data }) => {
  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.prismic.allBlog_homes.edges.slice(0, 1).pop()
  const posts = data.prismic.allPosts.edges
  const categories = data.prismic.allBlog_post_categorys.edges

  if (!doc) return null

  return (
    <Layout>
      <BlogHomeHead home={doc.node} categories={categories} />
      <BlogPosts posts={posts} />
    </Layout>
  )
}
