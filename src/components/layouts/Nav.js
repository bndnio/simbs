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

function NavItems({ navItems }) {
  if (!navItems) return null

  return (
    <>
      {navItems.map((navItem) => (
        <NavItem navItem={navItem} />
      ))}
    </>
  )
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

  // Hook to watch click position for mobile menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef && !navRef?.contains(event.target)) {
        setMobileMenu(false)
      }
    }

    // Bind the event listener
    document.addEventListener("click", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const doc = data.prismic.allNavigations.edges.slice(0, 1).pop()

  return (
    <nav>
      <div className="nav-placeholder"></div>
      <div className={`nav-shadow ${scroll ? "raised" : ""}`}></div>
      <div
        ref={setNavRef}
        className={`nav-bar ${scroll || mobileMenu ? "raised" : ""} ${
          mobileMenu ? "force-shadow" : ""
        }`}
      >
        <div className="nav-mobile">
          {mobileMenu ? (
            <span
              className="material-icons"
              onClick={() => setMobileMenu(false)}
            >
              close
            </span>
          ) : (
            <span
              className="material-icons"
              onClick={() => setMobileMenu(true)}
            >
              menu
            </span>
          )}
        </div>
        <img src={doc.node.logo.url} alt={doc.node.logo.alt} />
        <div className="nav-desktop">
          <NavItems navItems={doc.node.navto} />
        </div>
        <a
          className="cta"
          href="https://www.joinit.org/o/south-island-mountain-bike-society"
        >
          <span className={`join-button ${scroll ? "flat" : ""}`}>Join</span>
        </a>
        <div className={`nav-mobile-drawer ${mobileMenu ? "visible" : ""}`}>
          <NavItems navItems={doc.node.navto} />
        </div>
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
