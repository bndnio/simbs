import React from "react"

export function BannerBG({ url, hero, children }) {
  const bannerOpacity = 0.2
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
  const bannerOpacity = 0.2
  const banner = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, ${bannerOpacity}), rgba(0, 0, 0, ${bannerOpacity})), url('${url}')`,
  }

  return (
    <BannerBG url={url} hero={hero}>
      <div className="container banner-content">
        {title && <h1>{title}</h1>}
        {subtitle && <h4>{subtitle}</h4>}
      </div>
    </BannerBG>
  )
}

export default Banner
