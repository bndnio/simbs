import React from "react"
import { RichText } from "prismic-reactjs"
import { linkResolver } from "../../utils/linkResolver"
import htmlSerializer from "../../utils/htmlSerializer"

function Member({ member }) {
  if (!member) return null

  return (
    // Member section
    <div className="team-member">
      {/* Member portrait image */}
      <img className="team-member-portrait" src={member.portrait?.url}></img>
      {/* Member summary section */}
      <div className="team-member-summary">
        {/* Member summary header section */}
        <div className="team-member-head">
          {/* Render member name */}
          <h3>{RichText.asText(member.first_and_lastname)}</h3>
          {/* Render position title */}
          <h4 className="team-position">{RichText.asText(member.position)}</h4>
        </div>
        {/* Render description <p> from prismic */}
        {RichText.render(member.description, linkResolver, htmlSerializer)}
      </div>
    </div>
  )
}

function TeamHead({ team }) {
  // If team section header empty, abort
  if (!team?.team_section) return null

  // Render team section header
  return <h2>{RichText.asText(team?.team_section)}</h2>
}

export default function Team({ slice }) {
  // If team slice is empty, abort
  if (!slice) return null

  return (
    <div className="team container">
      {/* Render slice header */}
      <TeamHead team={slice.primary} />
      {/* Render team members */}
      {slice.fields.map((member) => (
        <Member member={member} />
      ))}
    </div>
  )
}
