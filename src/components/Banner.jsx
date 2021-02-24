import React from "react"

export function BannerBG({ url, hero, children }) {
  const bannerOpacity = hero ? 0.2 : 0.3
  const banner = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, ${bannerOpacity}), rgba(0, 0, 0, ${bannerOpacity})), url('${url}')`,
  }

  return (
    <div className={`banner ${hero ? "hero" : ""}`} style={url ? banner : {}}>
      <div className="banner-wrapper">{children}</div>
    </div>
  )
}

function Banner({ url, hero, title, subtitle }) {
  return (
    <BannerBG url={url} hero={hero}>
      <header className="banner-content">
        <div className="banner-content-unit">
          {title && <h1>{title}</h1>}
          {subtitle && <p className="h4">{subtitle}</p>}
        </div>
      </header>
    </BannerBG>
  )
}

export default Banner
