import React from "react"
import { StaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { useLocation } from "@reach/router"
import Analytics, { tagManagerScript } from "./Analytics"
import Nav from "./Nav"
import Footer from "./Footer"
import getTextPreview from "../../utils/getTextPreview"
import "../../stylesheets/main.scss"

export default (props) => (
  <StaticQuery
    query={graphql`
      query SiteQuery {
        site {
          siteMetadata {
            title
            keywords
            description
            author
          }
        }
      }
    `}
    render={(data) => <Layout {...props} data={data} />}
  />
)

const Layout = (props) => {
  const location = useLocation()

  // Pass along clearNav setting
  const { clearNav } = props

  // Define the meta title and description
  const {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    author: metaAuthor,
  } = props.data.site.siteMetadata

  const title = `${metaTitle}${props.title ? " - " : ""}${props.title || ""}`
  const keywords = props.keywords || metaKeywords
  const description = props.description || metaDescription
  const author = props.author || metaAuthor
  const image =
    props.image ||
    "https://images.prismic.io/simbs/d26dee7b-2f51-4f04-a717-c4dfcbf615fd_54204008_2569836563087963_7953484940551651328_n.jpg?auto=compress,format"
  const url = props.url || location.hostname

  const descriptionPreview = getTextPreview(description, 160)

  // Load the Prismic edit button
  if (typeof window !== "undefined" && window.prismic) {
    window.prismic.setupEditButton()
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={descriptionPreview} />
        <meta property="og:description" content={descriptionPreview} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <link
          href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900"
          rel="stylesheet"
          type="text/css"
        ></link>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        ></link>
        {tagManagerScript}
      </Helmet>
      <Analytics />
      <Nav clearNav={clearNav} />
      <main className={props.className}>{props.children}</main>
      <Footer />
    </>
  )
}
