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

function NavItems({ navItems, list }) {
  if (!navItems) return null

  return (
    <>
      {navItems.map((navItem, i) => (
        <NavItem list={list} navItem={navItem} key={i} />
      ))}
    </>
  )
}

function NavItem({ navItem, list }) {
  if (!navItem) return null

  if (list) {
    return (
      <li className="nav-item">
        <a href={navItem.page}>{navItem.page_name}</a>
      </li>
    )
  }

  return (
    <a className="nav-item btn btn-link" href={navItem.page}>
      {navItem.page_name}
    </a>
  )
}

function Nav({ clearNav, data }) {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scroll, setScroll] = useState(0)
  const [navRef, setNavRef] = useState(null)

  // Hook to watch scroll position for styling
  useEffect(() => {
    const checkScroll = () => {
      // Look at scroll position
      const scrollAtTop = window.scrollY < 10
      if (scrollAtTop !== scroll) {
        setScroll(!scrollAtTop)
      }
    }
    // Call on initial render
    checkScroll()
    const debouncedCheckScroll = debounce(checkScroll)
    // Bind the event listener
    document.addEventListener("scroll", debouncedCheckScroll, {
      passive: true,
    })
    // Unbind the event listener on clean up
    return () => {
      document.removeEventListener("click", debouncedCheckScroll)
    }
  }, [])

  const doc = data.prismic.allNavigations.edges.slice(0, 1).pop()

  return (
    <header>
      <div className="navbar-placeholder"></div>
      <nav className={`navbar ${clearNav && !scroll ? "clear-nav" : ""}`}>
        {/* Left nav */}
        <div className="navbar-section hide-md">
          <a href="/">
            <img
              className="logo"
              src={doc.node.logo.url}
              alt={doc.node.logo.alt}
            />
          </a>
        </div>
        <div className="navbar-section off-canvas show-md">
          <a
            className="off-canvas-toggle btn"
            onClick={() => setMobileMenu(true)}
          >
            <i className="icon icon-menu"></i>
          </a>
          <div className={`off-canvas-sidebar ${mobileMenu ? "active" : ""}`}>
            <ul className="nav">
              <li className="nav-item">
                <a href="/">
                  <img
                    className="mobile-logo"
                    src={doc.node.logo.url}
                    alt={doc.node.logo.alt}
                  />
                </a>
              </li>
              <NavItems list navItems={doc.node.navto} />
            </ul>
          </div>
          <div
            className="off-canvas-overlay"
            onClick={() => setMobileMenu(false)}
          ></div>
        </div>

        {/* Center nav */}
        {/* Don't show middle section if on small screen */}
        <div className="navbar-center hide-md">
          <NavItems navItems={doc.node.navto} />
        </div>

        {/* Right nav */}
        <div className="navbar-section">
          <a
            className="btn btn-clr"
            href="https://www.joinit.org/o/south-island-mountain-bike-society"
          >
            <span className="join-button">Join</span>
          </a>
        </div>
      </nav>
    </header>
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
                  _meta {
                    id
                  }
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
      render={(data) => <Nav {...props} data={data}></Nav>}
    />
  )
}
