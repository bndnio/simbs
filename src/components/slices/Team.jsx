import React from "react"
import { RichText } from "prismic-reactjs"
import linkResolver from "../../utils/linkResolver"
import htmlSerializer from "../../utils/htmlSerializer"

function Member({ member }) {
  if (!member) return null

  const Headshot = ({ url }) => {
    if (url)
      return (
        <img className="team-member-portrait" src={member.portrait?.url}></img>
      )
    return (
      <div className="team-member-portrait">
        <i className="icon icon-4x icon-people"></i>
      </div>
    )
  }

  return (
    // Member section
    <div className="team-member columns">
      {/* Member portrait image */}
      <div className="column col-3 col-md-4 col-sm-12">
        <Headshot url={member.portrait?.url} />
      </div>
      {/* Member summary section */}
      <div className="team-member-summary column col-9 col-md-8 col-sm-12">
        {/* Member summary header section */}
        <div className="team-member-head">
          {/* Render member name */}
          <h3>{RichText.asText(member.first_and_lastname.raw)}</h3>
          {/* Render position title */}
          <h4 className="team-member-position">
            {RichText.asText(member.position.raw)}
          </h4>
          {/* Render member name */}
          <a href={`mailto:${member.email}`} target="_blank">
            <span>{member.email}</span>
          </a>
        </div>
        {/* Render description <p> from prismic */}
        {RichText.render(member.description.raw, linkResolver, htmlSerializer)}
      </div>
    </div>
  )
}

function TeamHead({ team }) {
  // If team section header empty, abort
  if (!team?.team_section) return null

  // Render team section header
  return <h2>{RichText.asText(team?.team_section.raw)}</h2>
}

export default function Team({ slice }) {
  // If team slice is empty, abort
  if (!slice) return null

  return (
    <div className="team container column" id="team">
      {/* Render slice header */}
      <TeamHead team={slice.primary} />
      {/* Render team members */}
      {slice.items.map((member, i) => (
        <Member member={member} key={i} />
      ))}
    </div>
  )
}
