import React, { useState, useEffect } from "react"
import { StaticQuery, graphql } from "gatsby"

// The debounce function receives our function as a parameter
const debounce = (fn) => {
  // This holds the requestAnimationFrame reference, so we can cancel it if we wish
  let frame

  // The debounce function returns a new function that can receive a variable number of arguments
  return (...params) => {
    // If the frame variable has been defined, clear it now, and queue for next frame
    if (frame) {
      cancelAnimationFrame(frame)
    }

    // Queue our function call for the next frame
    frame = requestAnimationFrame(() => {
      // Call our function and pass any params we received
      fn(...params)
    })
  }
}

function NavItem({ navItem }) {
  if (!navItem) return null

  return (
    <a className="nav-item" href={navItem.page}>
      {navItem.page_name}
    </a>
  )
}

function Nav({ data }) {
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    document.addEventListener(
      "scroll",
      debounce(() => {
        const scrollCheck = window.scrollY < 10
        if (scrollCheck !== scroll) {
          setScroll(scrollCheck)
        }
      }),
      { passive: true }
    )
  }, [])

  const doc = data.prismic.allNavigations.edges.slice(0, 1).pop()

  return (
    <nav>
      <div className="nav-placeholder"></div>
      <div className={`nav-shadow ${scroll ? "" : "raised"}`}></div>
      <div className={`nav-bar ${scroll ? "" : "raised"}`}>
        <img src={doc.node.logo.url} alt={doc.node.logo.alt} />
        <div className="nav-items">
          {doc.node.navto.map((navItem) => (
            <NavItem navItem={navItem} />
          ))}
        </div>
        <a href="https://www.joinit.org/o/south-island-mountain-bike-society">
          <span className="join-button">Become a member</span>
        </a>
      </div>
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
