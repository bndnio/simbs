import React from "react"
import { withUnpublishedPreview } from "gatsby-source-prismic"
import Layout from "../components/layouts"
import PostTemplate from "../templates/post"

const NotFoundPage = () => (
  <Layout title="404">
    <div className="not-found">
      <h1>404</h1>
      <h2>Document not found</h2>
      <p>
        <a href="/">Return to homepage</a>
      </p>
    </div>
  </Layout>
)

// If an unpublished `post` document is previewed, PostTemplate will be rendered.
export default withUnpublishedPreview(NotFoundPage, {
  templateMap: {
    post: PostTemplate,
  },
})
