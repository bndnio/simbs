import React, { useState, useEffect } from "react"
import { StaticQuery, graphql } from "gatsby"
import { Link } from "gatsby"
import SimbsLandscapeLogo from "../../images/simbs-logo-landscape.svg"

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
        <Link
          to={navItem.page}
          getProps={({ isCurrent, isPartiallyCurrent }) => {
            if (isCurrent && isPartiallyCurrent)
              return {
                className: "nav-item selected",
              }
          }}
        >
          {navItem.page_name}
        </Link>
      </li>
    )
  }

  return (
    <Link
      className="nav-item btn btn-link"
      to={navItem.page}
      getProps={({ isCurrent, isPartiallyCurrent }) => {
        if (isCurrent && isPartiallyCurrent)
          return {
            className: "nav-item btn btn-link selected",
          }
      }}
    >
      {navItem.page_name}
    </Link>
  )
}

function Nav({ clearNav, data, navbarTop }) {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    const checkScroll = () => {
      const scrollAtTop = window.scrollY < 10
      setScroll((wasScrolled) => {
        const isScrolled = !scrollAtTop
        return wasScrolled === isScrolled ? wasScrolled : isScrolled
      })
    }
    checkScroll()
    const debouncedCheckScroll = debounce(checkScroll)
    document.addEventListener("scroll", debouncedCheckScroll, {
      passive: true,
    })
    return () => {
      document.removeEventListener("scroll", debouncedCheckScroll)
    }
  }, [])

  const navbarStyle = navbarTop != null ? { top: `${navbarTop}px` } : undefined

  const doc = data.allPrismicNavigation.edges.slice(0, 1).pop()

  return (
    <header>
      <div className="navbar-placeholder" />
      <nav
        className={`navbar ${clearNav && !scroll ? "clear-nav" : ""}`}
        style={navbarStyle}
      >
        {/* Left nav */}
        <div className="navbar-section hide-md">
          <a href="/">
            <SimbsLandscapeLogo className="logo" />
          </a>
        </div>
        <div className="navbar-section off-canvas show-md">
          <a
            className="off-canvas-toggle btn btn-clr"
            onClick={() => setMobileMenu(true)}
          >
            <i className="icon icon-menu"></i>
          </a>
          <div className={`off-canvas-sidebar ${mobileMenu ? "active" : ""}`}>
            <ul className="nav">
              <li className="nav-item">
                <a href="/">
                  <SimbsLandscapeLogo className="logo" />
                </a>
              </li>
              <NavItems list navItems={doc.node.data.navto} />
            </ul>
          </div>
          <div
            className="off-canvas-overlay"
            onClick={() => setMobileMenu(false)}
          ></div>
        </div>

        {/* Center nav */}
        <div className="navbar-center show-md">
          <a href="/">
            <SimbsLandscapeLogo className="logo" />
          </a>
        </div>
        <div className="navbar-center hide-md">
          <NavItems navItems={doc.node.data.navto} />
        </div>

        {/* Right nav */}
        <div className="navbar-section">
          <a
            className="btn btn-clr"
            href="https://www.trailforks.com/region/victoria/karma/?did=185"
            target="_blank"
          >
            Donate
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
          allPrismicNavigation {
            edges {
              node {
                id
                data {
                  navto {
                    page
                    page_name
                  }
                  logo {
                    url
                    alt
                  }
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
