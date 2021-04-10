import React from "react"
import { graphql, Link } from "gatsby"
import { RichText } from "prismic-reactjs"
import Layout from "../components/layouts"
import Categories from "../components/Categories"
import Slices from "../components/slices"

// Query for the Blog Post content in Prismic
export const query = graphql`
  query BlogPostQuery($uid: String) {
    prismicPost(uid: { eq: $uid }) {
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
                raw
              }
              text {
                raw
              }
            }
          }
          ... on PrismicPostBodyTextWithEmbed {
            slice_type
            slice_label
            primary {
              anchor
              text {
                raw
                html
              }
              title {
                raw
              }
              raw_embed {
                raw
              }
            }
          }

          ... on PrismicPostBodyPullQuote {
            slice_type
            slice_label
            primary {
              quote {
                raw
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
                raw
              }
            }
          }
          ... on PrismicPostBodyMedia {
            slice_type
            slice_label
            primary {
              media_caption {
                raw
              }
              media_link {
                type
                embed_url
                html
              }
              media_title {
                raw
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
                raw
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
  const titled = blogPost.data.title.length !== 0
  // Store and format the blog post's publication date
  let postDate = blogPost.data.date ? new Date(blogPost.data.date) : null
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
          <h1 data-wio-id={blogPost.id}>
            {titled ? RichText.asText(blogPost.data.title.raw) : "Untitled"}
          </h1>
          <div className="post-meta">
            {/* Render post date */}
            {postDate && (
              <span>
                Published <time>{postDate}</time>
              </span>
            )}
            {/* Render author if present */}
            {blogPost.data.author?.document && (
              <strong>
                {" // "}
                <span>
                  By {blogPost.data.author.document?.data?.first_name}{" "}
                  {blogPost.data.author.document?.data?.last_name}
                </span>
              </strong>
            )}
            {/* Render categories if present */}
            {blogPost.data.categories && (
              <Categories categories={blogPost.data.categories} />
            )}
          </div>
        </header>
      </div>
      {/* Render banner image if available */}
      {blogPost.data.banner && (
        <img className="post-banner" src={blogPost.data.banner.url}></img>
      )}
      {/* Put contents back in container */}
      <div className="container">
        {/* Go through the slices of the post and render the appropriate one */}
        <Slices slices={blogPost.data.body} />
        {/* Render acknowledgements */}
        {acknowledgements && (
          <p>{RichText.asText(blogPost.data.acknowledgements.raw)}</p>
        )}
      </div>
    </div>
  )
}

export default ({ data }) => {
  // Define the Post content returned from Prismic
  const doc = data.prismicPost
  if (!doc) return null

  const {
    title,
    author: postAuthor,
    seo_keywords,
    seo_description,
    banner,
  } = doc.data
  const author = postAuthor
    ? `${postAuthor.first_name} ${postAuthor.last_name}`
    : "SIMBS"

  return (
    <Layout
      title={RichText.asText(title.raw)}
      author={author}
      keywords={seo_keywords}
      description={seo_description}
      image={banner.url}
    >
      <PostBody blogPost={doc} />
    </Layout>
  )
}
