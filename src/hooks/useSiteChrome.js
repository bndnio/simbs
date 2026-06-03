import { useState, useEffect, useCallback, useRef } from "react"
import {
  ANNOUNCEMENT_BANNER_STORAGE_KEY,
  SITE_CHROME_BANNER_DISMISS_CLASS,
  getAnnouncementBannerVersion,
  isAnnouncementBannerEnabled,
} from "../utils/announcementBanner"

function getInitialDismissed(versionKey) {
  if (!versionKey) return true
  if (typeof window === "undefined") return false
  try {
    const chrome = document.querySelector(
      `.site-chrome[data-announcement-version="${versionKey}"]`
    )
    if (chrome?.classList.contains(SITE_CHROME_BANNER_DISMISS_CLASS)) {
      return true
    }
    return (
      sessionStorage.getItem(ANNOUNCEMENT_BANNER_STORAGE_KEY) === versionKey
    )
  } catch {
    return false
  }
}

function persistDismissed(versionKey) {
  try {
    sessionStorage.setItem(ANNOUNCEMENT_BANNER_STORAGE_KEY, versionKey)
  } catch {
    // sessionStorage unavailable
  }
}

function useNavbarBannerOffset(bannerVisible, bannerRef) {
  const [navbarTop, setNavbarTop] = useState(undefined)

  useEffect(() => {
    if (!bannerVisible) {
      setNavbarTop(undefined)
      return
    }

    const updateOffset = () => {
      const banner = bannerRef.current
      if (!banner || banner.hidden || banner.offsetHeight <= 0) {
        setNavbarTop(undefined)
        return
      }
      setNavbarTop(Math.max(0, banner.offsetHeight - window.scrollY))
    }

    updateOffset()
    window.addEventListener("scroll", updateOffset, { passive: true })
    return () => window.removeEventListener("scroll", updateOffset)
  }, [bannerVisible, bannerRef])

  return navbarTop
}

export function useSiteChrome(banner) {
  const bannerEnabled = isAnnouncementBannerEnabled(banner)
  const versionKey = getAnnouncementBannerVersion(banner)
  const bannerRef = useRef(null)

  const [dismissed, setDismissed] = useState(() =>
    getInitialDismissed(versionKey)
  )

  const dismissBanner = useCallback(() => {
    persistDismissed(versionKey)
    setDismissed(true)
  }, [versionKey])

  const bannerVisible = bannerEnabled && !dismissed
  const navbarTop = useNavbarBannerOffset(bannerVisible, bannerRef)

  return {
    bannerEnabled,
    versionKey,
    dismissed,
    dismissBanner,
    bannerRef,
    bannerVisible,
    navbarTop,
  }
}
