import React from "react"
import { RichText, Link } from "prismic-reactjs"
import { withPreview } from "gatsby-source-prismic"
import { graphql } from "gatsby"
import { BannerBG } from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"
import Posts from "../components/Posts"
import Dial from "../components/Dial"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    prismicHomePage {
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
    prismicSponsors {
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
    allPrismicPost(limit: 3, sort: { order: DESC, fields: data___date }) {
      nodes {
        id
        uid
        type
        data {
          title {
            raw
          }
          banner {
            url(imgixParams: { ar: "16:9", fit: "crop" })
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

  if (sponsor.link?.link_type === "Web") {
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
  // TODO: Remove return null once approved by the board
  return null

  highlights = {
    membership: {
      current: 591,
      goal: 800,
    },
    trailwork: {
      current: 412,
      goal: 2000,
    },
  }

  return (
    <div className="home-highlights">
      <h2>2021 Goals &amp; Highlights</h2>
      <div className="highlight-content">
        <div className="highlight-info">
          <Dial
            min={0}
            max={highlights.membership.goal}
            value={highlights.membership.current}
          />
          <h3>Registered Members</h3>
        </div>
        <div className="highlight-info">
          <p className="highlight-feature">Organ Donar</p>
          <p className="highlight-feature">Sofa King</p>
          <p className="highlight-feature">Heads Up</p>
          <h3>Recently Rebuilt</h3>
        </div>
        <div className="highlight-info">
          <Dial
            min={0}
            max={highlights.trailwork.goal}
            value={highlights.trailwork.current}
          />
          <h3>Trail Work Hours</h3>
        </div>
      </div>
    </div>
  )
}

const HomeNews = ({ posts = [] }) => {
  if (!posts.length) return null

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
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      ></iframe>
    </div>
  )
}

export default withPreview(({ data }) => {
  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.prismicHomePage
  if (!doc) return null

  const posts = data.allPrismicPost?.nodes
  const sponsors = data.prismicSponsors?.data?.sponsor

  const description = RichText.asText(doc.data.subtitle.raw)

  return (
    <Layout title="Home" description={description} className="home" clearNav>
      <HomeHead home={doc} />
      <Slices slices={doc.data.body} />
      <HomeSponsors title={doc.data.sponsors_title} sponsors={sponsors} />
      <HomeNews posts={posts} />
      <HomeHighlights />
      <HomeSocial />
    </Layout>
  )
})
