import React from "react"
import { RichText } from "prismic-reactjs"
import { withPreview } from "gatsby-source-prismic"
import { graphql } from "gatsby"
import Banner from "../components/Banner"
import Layout from "../components/layouts"
import Slices from "../components/slices"
import MembershipGraph from "../components/MembershipGraph"
import linkResolver from "../utils/linkResolver"
import htmlSerializer from "../utils/htmlSerializer"
import { Link as PrismicLink } from "prismic-reactjs"
import CTACards from "../components/slices/CTACards"
import {Link as GatsbyLink } from 'gatsby'

export const query = graphql`
  {
    prismicSponsors {
      data {
        sponsor {
          tier
          name
          logo {
            url
            alt
          }
          link {
            url
            target
            link_type
          }
        }
      }
      id
    }
  }
`


const SponsorshipHead = ({page}) => {
  const allTiers = [...new Set(page.data.sponsor.map(spons => spons.tier))]
  
  
  return (
    <section>
      <div className="sponsors-header" data-wio-id={page.id}>
        <Banner
          url={page.data.sponsor[0].logo?.url}
          title="Sponsorship"
          subtitle="Hella forage mumblecore sustainable kickstarter." 
        />
        <div className="sponsors-page">
          <div className="sponsor-buttons">
          {allTiers.map((tier) => {
          
          return (
            <GatsbyLink to="/sponsors-contact" className="tier-button">
            <h4>{tier} Tier</h4>
            <span className="btn">Become A Sponsor</span>
            </GatsbyLink>
          )
        })}
          </div>
          <div className="sponsors-body">
            <h2>Why Become A Sponsor?</h2>
            <p>PBR&B distillery you probably haven't heard of them asymmetrical occupy edison bulb 90's. Jean shorts hashtag viral shabby chic, freegan glossier migas lyft gentrify tbh thundercats enamel pin. Adaptogen fit mlkshk four loko farm-to-table venmo vape. Seitan JOMO flannel, venmo man braid sustainable gochujang chambray hella waistcoat edison bulb bicycle rights listicle shaman street art. Tonx craft beer godard, viral sartorial butcher meggings slow-carb four loko normcore distillery fanny pack air plant roof party knausgaard. Tilde tonx quinoa polaroid man braid kinfolk beard pop-up small batch authentic williamsburg health goth taxidermy vaporware.</p>
            <p>Poutine everyday carry vinyl vexillologist, listicle biodiesel shaman forage meggings chia tilde. Snackwave roof party neutra meggings, poutine iceland master cleanse before they sold out fit cardigan irony hot chicken normcore squid. Authentic flannel mlkshk kinfolk tonx readymade godard vape tofu health goth pug hoodie venmo pabst tumeric. Cardigan adaptogen squid glossier farm-to-table bruh.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const Sponsor = ({ sponsor }) => {
  return (
    <div className="sponsors-entry">
        <div>
          <img src={sponsor.logo?.url} alt={sponsor.logo?.alt} className="sponsors-image" />
        </div>
        <div className="sponsors-description">
          <h3>{sponsor.name}</h3>
          <p>Hexagon portland hammock mustache retro skateboard keytar raw denim, put a bird on it cloud bread activated charcoal vape umami hoodie. Seitan everyday carry pitchfork dreamcatcher scenester food truck bodega boys. Tbh church-key plaid messenger bag blue bottle viral kogi vape. Letterpress art party tumeric, hexagon meh authentic etsy. Brooklyn unicorn mustache poke iceland.</p>
          <span>website: {sponsor.link?.url}</span>
        </div>
    </div>
  )
}


const SponsorshipBody = ({ sponsors }) => {
  const allTiers = [...new Set(sponsors.map(sponsor => sponsor.tier))]

  return (
    <div className="sponsors-page">
        {allTiers.map((tier) => {
          const tierSponsors = sponsors.filter((sponsor) => sponsor.tier === tier)
          
          return (
            <div  className="sponsors-container">
              <h2 className="sponsors-title">{tier} Sponsors</h2>
              {tierSponsors.map((sponsor) => (
                <Sponsor sponsor={sponsor} />
                ))}
            </div>
          )
        })}
    </div>
  )
}


const SponsorshipPage = (({data}) => {
  const doc = data.prismicSponsors
  const sponsors = data.prismicSponsors.data.sponsor
  const allTiers = [...new Set(sponsors.map(sponsor => sponsor.tier))]


  return (
    <Layout title="Sponsorship">
      <SponsorshipHead page={doc}/>
      <Banner
        url={doc.data.sponsor[0].logo?.url}
        title="Our Sponsors"
        subtitle="Hella forage mumblecore sustainable kickstarter." 
      />
      <SponsorshipBody sponsors={sponsors}/>
      
    </Layout>
  )
})

export default SponsorshipPage