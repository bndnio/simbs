import React from "react"
import * as d3 from "d3"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import Banner from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"
import linkResolver from "../utils/linkResolver"
import htmlSerializer from "../utils/htmlSerializer"

// Query for the Blog Home content in Prismic
export const query = graphql`
  {
    allPrismicMembershipPage {
      edges {
        node {
          id
          data {
            title {
              raw
            }
            subtitle {
              raw
            }
            image {
              url
              alt
            }
            description {
              raw
            }
            body {
              ... on PrismicMembershipPageBodyText {
                slice_type
                slice_label
                primary {
                  anchor
                  text {
                    raw
                  }
                  title {
                    raw
                  }
                }
              }
              ... on PrismicMembershipPageBodyMedia {
                slice_type
                slice_label
                primary {
                  media_caption {
                    raw
                  }
                  media_link {
                    type
                    embed_url
                  }
                  media_title {
                    raw
                  }
                }
              }
              ... on PrismicMembershipPageBodyCtaCards {
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
                    link_type
                    target
                    url
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

// Using the queried Membership Page document data, we render the top section
const MembershipHead = ({ page }) => {
  return (
    <div className="membership-header" data-wio-id={page.id}>
      <Banner
        url={page.data.image?.url}
        title={page.data.title && RichText.asText(page.data.title.raw)}
        subtitle={page.data.subtitle && RichText.asText(page.data.subtitle.raw)}
      />

      {page.data.description && (
        <div className="container">
          {RichText.render(
            page.data.description.raw,
            linkResolver,
            htmlSerializer
          )}
        </div>
      )}
    </div>
  )
}

const MembershipGraph = ({ membership, width, height }) => {
  const strokeWidth = 6
  const fontSize = 20
  const offset = strokeWidth
  const [points, setPoints] = React.useState([])
  const [prePoint, setPrePoint] = React.useState([])

  React.useEffect(() => {
    const years = membership.map((m) => m.year)
    const nums = membership.map((m) => m.num)

    const xScale = d3
      .scaleLinear()
      .domain([Math.min(...years) - 0.25, Math.max(...years)])
      .range([0, width - offset * 4])
    const yScale = d3
      .scaleLinear()
      .domain([Math.max(...nums), Math.min(...nums)])
      .range([0 + offset, height - offset])

    const xPoints = years.map((x) => xScale(x))
    const yPoints = nums.map((y) => yScale(y))

    setPoints(d3.zip(xPoints, yPoints))

    const firstMembership = membership[0]
    const { year: firstYear, num: firstNum } = firstMembership

    const firstXPoint = xScale(firstYear - 0.25)
    const firstYPoint = yScale(firstNum * 0.95)

    setPrePoint([firstXPoint, firstYPoint])
  }, [width])

  return (
    <svg className="membership-graph" width={width} height={height}>
      <path
        className="line"
        fill="none"
        strokeWidth={strokeWidth}
        d={d3.line().curve(d3.curveMonotoneX)([prePoint, ...points])}
      ></path>
      {points.length &&
        membership.map((m, i) => {
          const xOffset = 50
          const yOffset = height / 4

          let [x, y] = points[i]
          const above = y + yOffset * 2 < height

          let line0X = x
          let line0Y = above ? y + strokeWidth * 1.5 : y - strokeWidth * 1.5
          let line1X = above ? x - xOffset : x + xOffset
          let line1Y = above
            ? y + yOffset - fontSize / 2
            : y - yOffset + fontSize / 2
          let textX = above ? x - xOffset : x + xOffset
          let textY = above ? y + yOffset + fontSize : y - yOffset
          return (
            <>
              <path
                fill="none"
                strokeWidth={strokeWidth / 2}
                d={d3.line().curve(d3.curveNatural)([
                  [line0X, line0Y],
                  [
                    (line0X + line1X) / 2 +
                      Math.abs(line0X - line1X) * (!above ? -0.2 : 0.2),
                    (line0Y + line1Y) * 0.5,
                  ],
                  [line1X, line1Y],
                ])}
              ></path>
              <text
                alignmentBaseline={above ? "bottom" : "top"}
                textAnchor="middle"
                fontSize={fontSize}
                x={textX}
                y={textY}
              >
                {m.year}: {m.num}
              </text>
            </>
          )
        })}
    </svg>
  )
}

const MembershipHighlights = ({ highlights }) => {
  const ref = React.useRef(null)
  const [width, setWidth] = React.useState(0)
  const height = 400

  highlights = {
    membership: [
      { year: 2016, num: 64 },
      { year: 2017, num: 85 },
      { year: 2018, num: 156 },
      { year: 2019, num: 245 },
      { year: 2020, num: 366 },
    ],
  }

  React.useEffect(() => {
    if (ref.current?.offsetWidth) setWidth(ref.current.offsetWidth)
  }, [ref.current])

  return (
    <div ref={ref} className="membership-highlights">
      <div className="text container">
        <h2>Memberships</h2>
      </div>
      <MembershipGraph
        membership={highlights.membership}
        height={height}
        width={width}
      />
    </div>
  )
}

export default ({ data }) => {
  // Define the Blog Home & Blog Post content returned from Prismic
  const doc = data.allPrismicMembershipPage.edges.slice(0, 1).pop()

  if (!doc || !doc.node) return null

  return (
    <Layout title="Membership">
      <MembershipHead page={doc.node} />
      <Slices slices={doc.node.data.body} />
      <MembershipHighlights />
    </Layout>
  )
}
