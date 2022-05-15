import React from "react"
import { Link } from "prismic-reactjs"
import { StaticQuery, graphql } from "gatsby"
import FacebookLogo  from "../../images/facebook-logo.svg"
import InstagramLogo  from "../../images/instagram-logo.svg"
import YoutubeLogo  from "../../images/youtube-logo.svg"

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
        <ul className="socials-row">
      <li className="social-item">
        <a href="https://www.facebook.com/southislandmtb" title="Facebook"><FacebookLogo /></a>
      </li>
      <li className="social-item">      
        <a href="https://www.instagram.com/southislandmountainbikesociety"><InstagramLogo /></a>
      </li>
      <li className="social-item">        
        <a href="https://www.youtube.com/channel/UCxGs25cRWX2hlSaqcCkE2KQ"title="Youtube"><YoutubeLogo /></a>
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
