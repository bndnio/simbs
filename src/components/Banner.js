import React from "react"

function Banner({ url, title, subtitle, children }) {
  const bannerOpacity = 0.2
  const banner = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, ${bannerOpacity}), rgba(0, 0, 0, ${bannerOpacity})), url('${url}')`,
  }

  return (
    <div className="banner" style={banner}>
      <div className="banner-wrapper">
        {children || (
          <div className="container banner-content">
            {/* <img src={url}></img> */}
            {title && <h1 className="banner-title">{title}</h1>}
            {subtitle && <h3 className="banner-subtitle">{subtitle}</h3>}
            {/* <a className="cta link" href={cta_link?.url}>
              {cta_text}
            </a> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default Banner
