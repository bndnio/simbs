import React from "react"
import { graphql, Link } from "gatsby"
import { RichText } from "prismic-reactjs"
import Layout from "../components/layouts"
import Categories from "../components/Categories"
import Slices from "../components/slices"

// Query for the Blog Post content in Prismic
export const query = graphql`
  query BlogPostQuery($uid: String) {
    allPrismicPost(filter: { uid: { eq: $uid } }) {
      edges {
        node {
          id
          uid
          type
          data {
            title {
              html
              text
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
            seo_keywords
            seo_description
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
              __typename
              ... on PrismicPostBodyText {
                slice_type
                slice_label
                primary {
                  anchor
                  title {
                    html
                    text
                  }
                  text {
                    html
                    text
                  }
                }
              }
              ... on PrismicPostBodyPullQuote {
                slice_type
                slice_label
                primary {
                  quote {
                    html
                    text
                  }
                }
              }
              ... on PrismicPostBodyImageWithCaption {
                slice_type
                slice_label
                primary {
                  image {
                    url
                    alt
                  }
                  image_caption {
                    html
                    text
                  }
                }
              }
              ... on PrismicPostBodyMedia {
                slice_type
                slice_label
                primary {
                  media_caption {
                    html
                    text
                  }
                  media_link {
                    type
                    embed_url
                  }
                  media_title {
                    html
                    text
                  }
                }
              }
              ... on PrismicPostBodyCallToAction {
                slice_type
                slice_label
                primary {
                  cta_link {
                    target
                    link_type
                    url
                  }
                  cta_title {
                    html
                    text
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

// Display the title, date, and content of the Post
const PostBody = ({ blogPost, acknowledgements }) => {
  const titled = blogPost.title.length !== 0
  // Store and format the blog post's publication date
  let postDate = blogPost.date ? new Date(blogPost.date) : null
  postDate = postDate
    ? new Intl.DateTimeFormat("en-CA", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(postDate)
    : ""

  return (
    <div className="post">
      {/* Put contents in width controleld box */}
      <div className="container">
        <header className="post-header">
          <div className="back">
            <Link to="/news">back to list</Link>
          </div>
          {/* Render the edit button */}
          <h1 data-wio-id={blogPost._meta.id}>
            {titled ? RichText.asText(blogPost.title) : "Untitled"}
          </h1>
          <div className="post-meta">
            {/* Render post date */}
            {postDate && (
              <span>
                Published <time>{postDate}</time>
              </span>
            )}
            {" // "}
            {/* Render author if present */}
            {blogPost.author && (
              <span>
                By {blogPost.author.first_name} {blogPost.author.last_name}
              </span>
            )}
            {/* Render categories if present */}
            {blogPost.categories && (
              <Categories categories={blogPost.categories} />
            )}
          </div>
        </header>
      </div>
      {/* Render banner image if available */}
      {blogPost.banner && (
        <img className="post-banner" src={blogPost.banner.url}></img>
      )}
      {/* Put contents back in container */}
      <div className="container">
        {/* Go through the slices of the post and render the appropriate one */}
        <Slices slices={blogPost.body} />
        {/* Render acknowledgements */}
        {acknowledgements && (
          <p>{RichText.asText(blogPost.acknowledgements)}</p>
        )}
      </div>
    </div>
  )
}

export default (props) => {
  // Define the Post content returned from Prismic
  const doc = props.data.prismic.allPosts.edges.slice(0, 1).pop()

  if (!doc || !doc.node) return null

  const {
    title,
    author: postAuthor,
    seo_keywords,
    seo_description,
    banner,
  } = doc.node
  const author = postAuthor
    ? `${postAuthor.first_name} ${postAuthor.last_name}`
    : "SIMBS"

  return (
    <Layout
      title={RichText.asText(title)}
      author={author}
      keywords={seo_keywords}
      description={seo_description}
      image={banner.url}
    >
      <PostBody blogPost={doc.node} />
    </Layout>
  )
}
