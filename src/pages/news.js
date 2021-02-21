import React from "react"
import { RichText } from "prismic-reactjs"
import { withPreview } from "gatsby-source-prismic"
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
    prismicBlogHome {
      id
      type
      data {
        title {
          raw
        }
        subtitle {
          raw
        }
        image {
          url
          alt
        }
      }
    }
    allPrismicPost(sort: { order: DESC, fields: data___date }) {
      nodes {
        id
        uid
        type
        data {
          title {
            raw
          }
          author {
            document {
              ... on PrismicAuthor {
                data {
                  first_name
                  last_name
                }
              }
            }
          }
          date
          banner {
            url
            alt
          }
          categories {
            category {
              document {
                ... on PrismicBlogPostCategory {
                  uid
                  data {
                    name
                  }
                }
              }
            }
          }
          body {
            ... on PrismicPostBodyText {
              slice_type
              primary {
                anchor
                title {
                  raw
                }
                text {
                  raw
                }
              }
            }
          }
        }
      }
    }
    allPrismicBlogPostCategory {
      nodes {
        uid
        data {
          name
          description {
            raw
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
  if (!post.node.data.categories) return false

  const postCategoryUids = post.node.data.categories.map(
    (c) => c?.category?.document?.uid
  )

  for (let postCategory of postCategoryUids) {
    if (categories.includes(postCategory)) return true
  }
  return false
}

// Using the queried News Home document data, we render the top section
const NewsHead = ({ page, categories }) => {
  return (
    <div className="news-header" data-wio-id={page.id}>
      <Banner
        url={page.data.image?.url}
        title={page.data.title && RichText.asText(page.data.title.raw)}
        subtitle={page.data.subtitle && RichText.asText(page.data.subtitle.raw)}
      />

      <div className="container">
        <Categories categories={categories} displayAll enableToggle />
      </div>
    </div>
  )
}

export default withPreview(({ data }) => {
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
  const doc = data.prismicBlogHome
  if (!doc) return null

  const posts = data.allPrismicPost.nodes
  const categories = data.allPrismicBlogPostCategory.nodes

  const filteredPosts = posts.filter((post) =>
    postHasCategories(post, getCategoryQueryParams())
  )

  return (
    <Layout title="News">
      <NewsHead page={doc} categories={categories} />
      <Posts posts={filteredPosts} />
    </Layout>
  )
})
