import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import { useLocation } from "@reach/router"
import queryString from "query-string"
import Layout from "../components/layouts"
import Banner from "../components/Banner"
import Posts from "../components/Posts"
import Categories from "../components/Categories"
import toArray from "../utils/toArray"

// Query for the News Home content in Prismic
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
            title
            subtitle
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
                  title
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
    (category) => category?.category?._meta.uid
  )

  for (let postCategory of postCategoryUids) {
    if (categories.includes(postCategory)) return true
  }
  return false
}

// Using the queried News Home document data, we render the top section
const NewsHead = ({ page, categories }) => {
  return (
    <div className="news-header" data-wio-id={page._meta.id}>
      <Banner
        url={page.image?.url}
        title={page.title && RichText.asText(page.title)}
        subtitle={page.subtitle && RichText.asText(page.subtitle)}
      />

      <div className="container">
        <Categories categories={categories} displayAll enableToggle />
      </div>
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

  // Define the News Home & News Post content returned from Prismic
  const doc = data.prismic.allBlog_homes.edges.slice(0, 1).pop()
  const posts = data.prismic.allPosts.edges
  const categories = data.prismic.allBlog_post_categorys.edges

  if (!doc) return null

  const filteredPosts = posts.filter((post) =>
    postHasCategories(post, getCategoryQueryParams())
  )

  return (
    <Layout>
      <NewsHead page={doc.node} categories={categories} />
      <Posts posts={filteredPosts} />
    </Layout>
  )
}
