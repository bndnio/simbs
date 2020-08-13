import React from "react"
import { StaticQuery, graphql } from "gatsby"

function NavItem({ navItem }) {
  if (!navItem) return null

  return (
    <a className="nav-item" href={navItem.page}>
      {navItem.page_name}
    </a>
  )
}

function Nav({ data }) {
  const doc = data.prismic.allNavigations.edges.slice(0, 1).pop()

  return (
    <nav>
      <img src={doc.node.logo.url} alt={doc.node.logo.alt} />
      <div className="nav-items">
        {doc.node.navto.map((navItem) => (
          <NavItem navItem={navItem} />
        ))}
      </div>
      <a href="https://www.joinit.org/o/south-island-mountain-bike-society">
        <span className="join-button">Become a member</span>
      </a>
    </nav>
  )
}

export default function (props) {
  return (
    <StaticQuery
      query={graphql`
        query NavQuery {
          prismic {
            allNavigations {
              edges {
                node {
                  navto {
                    page
                    page_name
                  }
                  logo
                }
              }
            }
          }
        }
      `}
      render={(data) => <Nav data={data}></Nav>}
    />
  )
}
