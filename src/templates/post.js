import React from "react"
import { graphql, Link } from "gatsby"
import { RichText } from "prismic-reactjs"
import Layout from "../components/layouts"
import Categories from "../components/Categories"
import Slices from "../components/slices"

// Query for the Blog Post content in Prismic
export const query = graphql`
  query BlogPostQuery($uid: String) {
    prismic {
      allPosts(uid: $uid) {
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
            seo_keywords
            seo_description
            banner
            categories {
              category {
                ... on PRISMIC_Blog_post_category {
                  name
                  _meta {
                    uid
                  }
                }
              }
            }
            body {
              __typename
              ... on PRISMIC_PostBodyText {
                type
                label
                primary {
                  anchor
                  title
                  text
                }
              }
              ... on PRISMIC_PostBodyPull_quote {
                type
                label
                primary {
                  quote
                }
              }
              ... on PRISMIC_PostBodyImage_with_caption {
                type
                label
                primary {
                  image
                  image_caption
                }
              }
              ... on PRISMIC_PostBodyMedia {
                type
                label
                primary {
                  media_caption
                  media_link
                  media_title
                }
              }
              ... on PRISMIC_PostBodyCall_to_action {
                type
                label
                primary {
                  cta_link {
                    ... on PRISMIC__ExternalLink {
                      target
                      url
                    }
                  }
                  cta_title
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
            <Link to="/blog">back to list</Link>
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

  const { title, author: postAuthor, seo_keywords, seo_description } = doc.node
  const author = postAuthor
    ? `${postAuthor.first_name} ${postAuthor.last_name}`
    : "SIMBS"

  return (
    <Layout
      title={RichText.asText(title)}
      author={author}
      keywords={seo_keywords}
      description={seo_description}
    >
      <PostBody blogPost={doc.node} />
    </Layout>
  )
}
