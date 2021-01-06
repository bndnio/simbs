import React from "react"
import { Link } from "gatsby"
import { RichText, Date } from "prismic-reactjs"
import linkResolver from "../utils/linkResolver"
import getTextPreview from "../utils/getTextPreview"
import Categories from "./Categories"

// Function to retrieve a small preview of the post's text
const firstParagraph = (post) => {
  // Find the first text slice of post's body
  let firstTextSlice = post.data.body
    ? post.data.body.find((slice) => slice.type === "text")
    : null
  if (firstTextSlice != null) {
    // Set the character limit for the text we'll show in the homepage
    const textLimit = 160
    const text = RichText.asText(firstTextSlice.primary.text.raw)
    return <p>{getTextPreview(text, textLimit)}</p>
  } else {
    // If there are no slices of type 'text', return nothing
    return null
  }
}

// A summary of the Blog Post
const PostSummary = ({ post }) => {
  // Store and format the blog post's publication date
  let postDate = post.data.date ? new Date(post.data.date) : null
  postDate = postDate
    ? new Intl.DateTimeFormat("en-CA", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(postDate)
    : ""

  // Default title when post has no title set
  const defaultTitle = "Untitled"
  const defaultAuthor = "SIMBS"

  return (
    // We render a link to a particular post using the linkResolver for the url and its title
    <div className="column col-4 col-lg-6 col-sm-12">
      <div className="card post-card">
        <Link to={linkResolver(post)}>
          {post.data.banner && (
            <div className="card-image">
              <img src={post.data.banner.url}></img>
            </div>
          )}
          <div className="card-header">
            <h2 className="card-title h5">
              {RichText.asText(post.data.title.raw).length !== 0
                ? RichText.asText(post.data.title.raw)
                : defaultTitle}
            </h2>
            <div className="card-subtitle text-gray">
              <strong>
                <time>{postDate}</time>
              </strong>
              {`${postDate && "  "}// `}
              {post.data.author
                ? `By ${post.data.author.first_name} ${post.data.author.last_name}`
                : defaultAuthor}
            </div>
            <Categories categories={post.data.categories} />
          </div>
          {/* Render a small preview of the post's text */}
          <div className="card-body">{firstParagraph(post)}</div>
        </Link>
      </div>
    </div>
  )
}

export default ({ posts }) => {
  if (!posts) return null

  return (
    <section className="columns container blog-posts">
      {posts.map((post) => {
        return <PostSummary post={post.node} key={post.node.id} />
      })}
    </section>
  )
}
