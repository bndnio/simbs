import React from "react"
import { withPreviewResolver } from "gatsby-source-prismic"
import { navigate } from "@reach/router"
import linkResolver from "../utils/linkResolver"
import Layout from "../components/layouts"

const PreviewPage = ({ isPreview, isLoading }) => {
  if (isPreview === false) {
    navigate("/")
    return null
  }

  return (
    <Layout>
      <p>Loading: {!!isLoading}</p>
    </Layout>
  )
}

export default withPreviewResolver(PreviewPage, {
  repositoryName: "simbs",
  linkResolver,
})
