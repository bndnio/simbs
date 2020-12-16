import React, { Fragment } from "react"
import { StaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"
import Nav from "./Nav"
import Footer from "./Footer"
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
  // Pass along clearNav setting
  const { clearNav } = props
  // Define the meta title and description
  const title = props.title || props.data.site.siteMetadata.title
  const keywords = props.keywords || props.data.site.siteMetadata.keywords
  const description =
    props.description || props.data.site.siteMetadata.description
  const author = props.author || props.data.site.siteMetadata.author

  // Load the Prismic edit button
  if (typeof window !== "undefined" && window.prismic) {
    window.prismic.setupEditButton()
  }

  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
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
      </Helmet>
      <Nav clearNav={clearNav} />
      <main>{props.children}</main>
      <Footer />
    </Fragment>
  )
}
