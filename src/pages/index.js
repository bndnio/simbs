import React from "react"
import { RichText, Link } from "prismic-reactjs"
import { graphql } from "gatsby"
import { BannerBG } from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"

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
            <a className="btn btn-clr" href={home.data.cta_link?.url}>
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

const HomeNews = ({ news }) => {
  return null
}

const HomeSocial = ({ social }) => {
  return null
}

export default ({ data }) => {
  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.allPrismicHomePage.edges.slice(0, 1).pop()
  if (!doc || !doc.node) return null

  const description = RichText.asText(doc.node.data.subtitle.raw)

  let sponsors = data.allPrismicSponsors.edges.slice(0, 1).pop()
  sponsors = sponsors?.node?.data?.sponsor

  return (
    <Layout title="Home" description={description} clearNav>
      <HomeHead home={doc.node} />
      <HomeSponsors title={doc.node?.data.sponsors_title} sponsors={sponsors} />
      <Slices slices={doc.node.data.body} />
      <HomeHighlights />
      <HomeNews />
      <HomeSocial />
    </Layout>
  )
}
