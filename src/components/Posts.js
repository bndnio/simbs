import React from "react"
import { Link } from "gatsby"
import { RichText, Date } from "prismic-reactjs"
import { linkResolver } from "../utils/linkResolver"
import getTextPreview from "../utils/getTextPreview"
import Categories from "./Categories"

// Function to retrieve a small preview of the post's text
const firstParagraph = (post) => {
  // Find the first text slice of post's body
  let firstTextSlice = post.body
    ? post.body.find((slice) => slice.type === "text")
    : null
  if (firstTextSlice != null) {
    // Set the character limit for the text we'll show in the homepage
    const textLimit = 160
    const text = RichText.asText(firstTextSlice.primary.text)
    return <p>{getTextPreview(text, textLimit)}</p>
  } else {
    // If there are no slices of type 'text', return nothing
    return null
  }
}

// A summary of the Blog Post
const PostSummary = ({ post }) => {
  // Store and format the blog post's publication date
  let postDate = post.date ? new Date(post.date) : null
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
        <Link to={linkResolver(post._meta)}>
          {post.banner && (
            <div className="card-image">
              <img src={post.banner.url}></img>
            </div>
          )}
          <div className="card-header">
            <h2 className="card-title h5">
              {RichText.asText(post.title).length !== 0
                ? RichText.asText(post.title)
                : defaultTitle}
            </h2>
            <div className="card-subtitle text-gray">
              <strong>
                <time>{postDate}</time>
              </strong>
              {`${postDate && "  "}// `}
              {post.author
                ? `By ${post.author.first_name} ${post.author.last_name}`
                : defaultAuthor}
            </div>
            <Categories categories={post.categories} />
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
        return <PostSummary post={post.node} key={post.node._meta.id} />
      })}
    </section>
  )
}
