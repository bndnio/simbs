import React from "react"
import { Link as PrismicLink, RichText } from "prismic-reactjs"
import { StaticQuery, graphql } from "gatsby"
import FacebookLogo from "../../images/facebook-logo.svg"
import InstagramLogo from "../../images/instagram-logo.svg"
import YoutubeLogo from "../../images/youtube-logo.svg"

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
    prismicTerritorialAcknowledgement {
      dataRaw {
        text {
          type
          text
          spans {
            end
            type
            start
          }
        }
      }
    }
  }
`

function Sponsor({ sponsor }) {
  return (
    <a
      href={PrismicLink.url(sponsor.link)}
      rel="noopener"
      target={sponsor.link?.target}
    >
      <img src={sponsor.logo.url} alt={sponsor.logo.alt} className="sponsor" />
    </a>
  )
}

function Sponsors({ sponsors, hideTopTierSponsors }) {
  const doubleBlackSponsors = sponsors.filter(
    (sponsor) => sponsor.tier === "Double Black Diamond"
  )
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
          <h5 className="sponsors-row-title">Double Black Diamond Sponsors</h5>
          <div className="sponsors-row">
            {doubleBlackSponsors.map((sponsor) => (
              <Sponsor sponsor={sponsor} />
            ))}
          </div>
        </>
      )}
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

  const ackText = props.prismicTerritorialAcknowledgement.dataRaw.text

  return (
    <footer>
      <div className="container">
        <div className="acknowledge-text">{RichText.render(ackText)}</div>
        <Sponsors
          sponsors={props.prismicSponsors.data.sponsor}
          hideTopTierSponsors={hideTopTierSponsors}
        />
        <ul className="socials-row">
          <li className="social-item">
            <a href="https://www.facebook.com/southislandmtb" title="Facebook">
              <FacebookLogo />
            </a>
          </li>
          <li className="social-item">
            <a href="https://www.instagram.com/southislandmountainbikesociety">
              <InstagramLogo />
            </a>
          </li>
          <li className="social-item">
            <a
              href="https://www.youtube.com/channel/UCxGs25cRWX2hlSaqcCkE2KQ"
              title="Youtube"
            >
              <YoutubeLogo />
            </a>
          </li>
        </ul>
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
