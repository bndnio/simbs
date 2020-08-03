import React from "react"
import prismicLogo from "../../images/logo-prismic.svg"

export default () => (
  <footer>
    <div className="container">
      <p>
        Made by{" "}
        <a
          href="https://github.io/bndnio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Brendon
        </a>
        <br />
        <a href="https://prismic.io" target="_blank" rel="noopener noreferrer">
          <img
            className="footer-logo"
            src={prismicLogo}
            alt="Gray Prismic logo"
          />
        </a>
      </p>
    </div>
  </footer>
)
