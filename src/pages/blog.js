import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import { useLocation } from "@reach/router"
import queryString from "query-string"
import Layout from "../components/layouts"
import BlogPosts from "../components/BlogPosts"
import Categories from "../components/Categories"
import toArray from "../utils/toArray"

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
            author {
              ... on PRISMIC_Author {
                first_name
                last_name
              }
            }
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
                  anchor
                  text_title
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

function postHasCategories(post, categories) {
  // If categories are falsey allow all posts
  if (!categories) return true
  if (categories.length == 0) return true

  // If post doesn't have category, disallow
  if (!post.node.categories) return false

  const postCategoryUids = post.node.categories.map(
    (category) => category.category._meta.uid
  )

  for (let postCategory of postCategoryUids) {
    console.log("categories", categories)
    console.log("postcategory", postCategory)
    if (categories.includes(postCategory)) return true
  }
  return false
}

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
  // Get router location hook
  const location = useLocation()

  // Get list of query param values from 'category' query params
  const getCategoryQueryParams = () => {
    // Build category query param list from url
    const queryParams = queryString.parse(location.search)
    const queryCategories = toArray(queryParams.category)

    return queryCategories
  }

  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.prismic.allBlog_homes.edges.slice(0, 1).pop()
  const posts = data.prismic.allPosts.edges
  const categories = data.prismic.allBlog_post_categorys.edges

  if (!doc) return null

  const filteredPosts = posts.filter((post) =>
    postHasCategories(post, getCategoryQueryParams())
  )

  return (
    <Layout>
      <BlogHomeHead home={doc.node} categories={categories} />
      <BlogPosts posts={filteredPosts} />
    </Layout>
  )
}
