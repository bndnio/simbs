import React from "react"
import { Link } from "prismic-reactjs"
import { StaticQuery, graphql } from "gatsby"

const sponsorQuery = graphql`
  query MyQuery {
    prismicSponsors {
      data {
        sponsor {
          link {
            url
            link_type
            target
          }
          name
          logo {
            alt
            url(imgixParams: { height: 100 })
          }
          tier
        }
      }
    }
  }
`

function Sponsor({ sponsor }) {
  return (
    <a
      href={Link.url(sponsor.link)}
      rel="noopener"
      target={sponsor.link?.target}
    >
      <img src={sponsor.logo.url} alt={sponsor.logo.alt} className="sponsor" />
    </a>
  )
}

function Sponsors({ sponsors, hideTopTierSponsors }) {
  const blackSponsors = sponsors.filter(
    (sponsor) => sponsor.tier === "Black Diamond"
  )
  const blueSponsors = sponsors.filter(
    (sponsor) => sponsor.tier === "Blue Square"
  )

  return (
    <>
      {!hideTopTierSponsors && (
        <>
          <h5 className="sponsors-row-title">Black Diamond Sponsors</h5>
          <div className="sponsors-row">
            {blackSponsors.map((sponsor) => (
              <Sponsor sponsor={sponsor} />
            ))}
          </div>
        </>
      )}
      <h5 className="sponsors-row-title">Blue Square Sponsors</h5>
      <div className="sponsors-row">
        {blueSponsors.map((sponsor) => (
          <Sponsor sponsor={sponsor} />
        ))}
      </div>
    </>
  )
}

function Footer(props) {
  const { hideTopTierSponsors } = props
  const currentYear = new Date().getFullYear()

  return (
    <footer>
      <div className="container">
        <Sponsors
          sponsors={props.prismicSponsors.data.sponsor}
          hideTopTierSponsors={hideTopTierSponsors}
        />
        <p>
          ©{currentYear} South Island Mountain Bike Society | Made with 🖤 by{" "}
          <a
            href="https://github.com/bndnio"
            target="_blank"
            rel="noopener noreferrer"
          >
            Brendon
          </a>
        </p>
      </div>
    </footer>
  )
}

export default function () {
  return <StaticQuery query={sponsorQuery} render={Footer} />
}
