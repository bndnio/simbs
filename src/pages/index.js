import React from "react"
import { RichText, Link } from "prismic-reactjs"
import { graphql } from "gatsby"
import { BannerBG } from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"
import Posts from "../components/Posts"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    allPrismicHomePage {
      edges {
        node {
          id
          type
          data {
            cta_link {
              target
              link_type
              url
            }
            sponsors_title {
              raw
            }
            subtitle {
              raw
            }
            cta_text {
              raw
            }
            title {
              raw
            }
            banner {
              url
              alt
            }
            body {
              ... on PrismicHomePageBodyCtaCards {
                slice_type
                slice_label
                primary {
                  cta_cards_title {
                    raw
                  }
                  cta_explainer_text {
                    raw
                  }
                }
                items {
                  card_description {
                    raw
                  }
                  cta_background {
                    url
                    alt
                  }
                  card_title {
                    raw
                  }
                  cta_text {
                    raw
                  }
                  cta_internal_link
                  cta_link {
                    target
                    link_type
                    url
                  }
                }
              }
              ... on PrismicHomePageBodyText {
                slice_type
                slice_label
                primary {
                  text {
                    raw
                  }
                  title {
                    raw
                  }
                  anchor
                }
              }
            }
          }
        }
      }
    }
    allPrismicSponsors {
      edges {
        node {
          data {
            sponsor {
              logo {
                url
                alt
              }
              name
              link {
                target
                link_type
                url
              }
            }
          }
        }
      }
    }
    allPrismicPost(limit: 3, sort: { order: DESC, fields: data___date }) {
      edges {
        node {
          id
          uid
          type
          data {
            title {
              raw
            }
            banner {
              url
              alt
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
              uid
            }
            date
            seo_keywords
            seo_description
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
            }
          }
        }
      }
    }
  }
`

// Using the queried Blog Home document data, we render the top section
const HomeHead = ({ home }) => {
  return (
    <div className="home-header" data-wio-id={home.id}>
      <BannerBG hero url={home.data.banner.url}>
        <div className="banner-content">
          <div className="banner-content-unit">
            <h1>{RichText.asText(home.data.title.raw)}</h1>
            <p className="h4">{RichText.asText(home.data.subtitle.raw)}</p>
            <a
              className="btn btn-clr"
              href={home.data.cta_link?.url}
              target="_blank"
            >
              {RichText.asText(home.data.cta_text.raw)}
            </a>
          </div>
        </div>
      </BannerBG>
    </div>
  )
}

const HomeSponsor = ({ sponsor }) => {
  if (!sponsor?.logo) return null
  const SponsorImg = () => <img src={sponsor.logo.url} alt={sponsor.logo.alt} />

  if (sponsor.link?.link_type === "Link.web") {
    return (
      <a
        href={Link.url(sponsor.link)}
        rel="noopener"
        target={sponsor.link?.target}
      >
        <SponsorImg />
      </a>
    )
  }

  return <SponsorImg />
}

const HomeSponsors = ({ title, sponsors = [] }) => {
  if (!sponsors.length) return null

  return (
    <div className="home-sponsors">
      {title && (
        <h2 className="h3 sponsors-title">{RichText.asText(title.raw)}</h2>
      )}
      <div className="sponsors-row">
        {sponsors.map((sponsor, i) => (
          <HomeSponsor sponsor={sponsor} key={i} />
        ))}
      </div>
    </div>
  )
}

const HomeHighlights = ({ highlights }) => {
  return null
}

const HomeNews = ({ posts }) => {
  return (
    <div className="home-news">
      <h2>Latest News</h2>
      <Posts posts={posts} />
    </div>
  )
}

const HomeSocial = ({ social }) => {
  return (
    <div className="home-social">
      <iframe
        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsouthislandmtb%2F&tabs=timeline&width=450&height=500&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId=291997394173672"
        width="450"
        height="500"
        style={{ border: "none", overflow: "hidden" }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen="true"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      ></iframe>
    </div>
  )
}

export default ({ data }) => {
  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.allPrismicHomePage.edges.slice(0, 1).pop()
  if (!doc || !doc.node) return null

  const posts = data.allPrismicPost.edges

  const description = RichText.asText(doc.node.data.subtitle.raw)

  let sponsors = data.allPrismicSponsors.edges.slice(0, 1).pop()
  sponsors = sponsors?.node?.data?.sponsor

  return (
    <Layout title="Home" description={description} className="home" clearNav>
      <HomeHead home={doc.node} />
      <Slices slices={doc.node.data.body} />
      <HomeSponsors title={doc.node?.data.sponsors_title} sponsors={sponsors} />
      <HomeHighlights />
      <HomeNews posts={posts} />
      <HomeSocial />
    </Layout>
  )
}
