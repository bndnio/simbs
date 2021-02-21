import React from "react"
import { RichText } from "prismic-reactjs"
import { graphql } from "gatsby"
import Banner from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"
import MembershipGraph from "../components/MembershipGraph"
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

const MembershipHighlights = ({ highlights }) => {
  const ref = React.useRef(null)
  const [width, setWidth] = React.useState(0)
  const height = 400

  highlights = {
    membership: [
      // { year: 2016, num: 64 },
      // // { year: 2017, num: 85 },
      // { year: 2017, num: 91 },
      // { year: 2018, num: 156 },
      { year: 2018, num: 171 },
      // { year: 2019, num: 245 },
      { year: 2019, num: 262 },
      // { year: 2020, num: 366 },
      { year: 2020, num: 404 },
      { year: 2021, num: 650 },
    ],
  }

  React.useEffect(() => {
    if (ref.current?.offsetWidth) setWidth(ref.current.offsetWidth)
  }, [ref.current])

  return (
    <div ref={ref} className="membership-highlights">
      <div className="text container">
        <h2>Membership Growth</h2>
      </div>
      <MembershipGraph
        membership={highlights.membership}
        height={height}
        width={width}
      />
      <p className="container">* Goal membership</p>
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
