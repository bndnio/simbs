import React from "react"
import * as d3 from "d3"
import { RichText, Link } from "prismic-reactjs"
import { graphql } from "gatsby"
import { BannerBG } from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"
import Posts from "../components/Posts"
import { useIsVisible } from "react-is-visible"

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
  const ref = React.useRef(null)
  const [width, setWidth] = React.useState(0)
  const height = 400

  React.useEffect(() => {
    if (ref.current?.offsetWidth) setWidth(ref.current.offsetWidth)
  }, [ref.current])

  highlights = {
    membership: {
      current: 420,
      goal: 650,
    },
  }

  return (
    <div ref={ref} className="home-highlights">
      {/* <h2>Highlights</h2> */}
      <div className="highlight-content">
        <div className="highlight-info">
          <Dial
            min={0}
            max={highlights.membership.goal}
            value={highlights.membership.current}
          />
          <h3 className="">2021 Membership Goal</h3>
        </div>
        <div className="highlight-info">
          <h3>Recently Rebuilt</h3>
          <p className="highlight-feature">Organ Donar</p>
          <p className="highlight-feature">Sofa King</p>
          <p className="highlight-feature">Heads Up</p>
        </div>
        <div className="highlight-info">
          {/* <h3>Trail Sweat</h3> */}
          <h4>2020 Work Hours</h4>
          <p className="highlight-feature">42069</p>
          <h4>2021 Work Hours</h4>
          <p className="highlight-feature">420</p>
        </div>
      </div>
    </div>
  )
}

function Dial(props) {
  const { min, max, value, width = 300, height = 300 } = props
  const padding = 20
  const numPoints = 100
  const transitionTime = 1000

  const valuePath = React.useRef(null)
  const dialIsVisible = useIsVisible(valuePath)
  const [valueNum, setValueNum] = React.useState(0)
  const [visible, setVisible] = React.useState(false)
  const [dialPoints, setDialPoints] = React.useState([])

  function getPosFromAngle(angle) {
    const xScale = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([padding, width - padding])
    const yScale = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([padding, height - padding])

    const x = xScale(Math.cos(angle))
    const y = yScale(Math.sin(angle))
    return [x, y]
  }

  React.useEffect(() => {
    const scale = d3
      .scaleLinear()
      .domain([0, numPoints - 1])
      .range([0.5 * Math.PI, 2.5 * Math.PI])

    const points = d3.range(numPoints).map(function (_, i) {
      const angle = scale(i)
      return getPosFromAngle(angle)
    })

    setDialPoints(points)
  }, [])

  React.useEffect(() => {
    const valueScale = d3
      .scaleLinear()
      .domain([0, numPoints - 1])
      .range([min, value])
    const angleScale = d3
      .scaleLinear()
      .domain([min, max])
      .range([0.5 * Math.PI, 2.5 * Math.PI])

    const points = d3.range(numPoints).map(function (_, i) {
      const angle = angleScale(valueScale(i))
      return getPosFromAngle(angle)
    })

    let line = d3.line()([getPosFromAngle(angleScale(0))])
    if (visible) {
      line = d3.line()(points)
    }

    const path = d3.select(valuePath.current).attr("d", line)
    const totalLength = path.node().getTotalLength()
    path
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(transitionTime)
      .ease(d3.easePolyOut)
      .attr("stroke-dashoffset", 0)
  }, [visible])

  React.useEffect(() => {
    const intervalTime = transitionTime / 50
    const intervalNum = value / 50

    const nextValue = Math.min(valueNum + intervalNum, value)
    if (nextValue >= value || !visible) return

    setTimeout(() => {
      setValueNum(nextValue)
    }, intervalTime)
  }, [visible, valueNum])

  React.useEffect(() => {
    if (dialIsVisible) {
      setVisible(true)
    }
  }, [dialIsVisible])

  return (
    <svg width={width} height={height} onClick={() => setVisible(!visible)}>
      <path
        className="dial-line"
        fill="none"
        strokeWidth={2}
        d={d3.line().curve(d3.curveNatural)(dialPoints)}
      ></path>
      <path
        className="value-line"
        fill="none"
        strokeWidth={2}
        ref={valuePath}
      ></path>

      <text textAnchor="middle" fontSize={30} x={width / 2} y={height / 2 + 30}>
        of {max}
      </text>
      <text
        textAnchor="middle"
        // fontSize={60}
        className="highlight-feature lrg"
        x={width / 2}
        y={height / 2}
      >
        {valueNum.toFixed(0)}
      </text>
    </svg>
  )
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
    <Layout className="home" title="Home" description={description} clearNav>
      <HomeHead home={doc.node} />
      <Slices slices={doc.node.data.body} />
      <HomeSponsors title={doc.node?.data.sponsors_title} sponsors={sponsors} />
      <HomeHighlights />
      <HomeNews posts={posts} />
      {/* <HomeSocial /> */}
    </Layout>
  )
}
