import React, { useState, useEffect } from "react"
import { navigate, useLocation } from "@reach/router"
import queryString from "query-string"
import toArray from "../utils/toArray"

function Category({ category, enableToggle }) {
  // Get router location hook
  const location = useLocation()

  // Get list of query param values from 'category' query params
  const getCategoryQueryParams = () => {
    // Build category query param list from url
    const queryParams = queryString.parse(location.search)
    const queryCategories = toArray(queryParams.category)

    return queryCategories
  }

  // Is current category in url query parameters
  const isInUrl = () => {
    const queryCategories = getCategoryQueryParams()
    return queryCategories.includes(category._meta.uid)
  }

  // Set initial state by looking at url state
  const [selected, setSelected] = useState(isInUrl())

  // Change selected state on query param state
  useEffect(() => {
    const queryCategories = getCategoryQueryParams()

    // If this category is selected
    if (queryCategories.includes(category._meta.uid)) {
      setSelected(true)
      // If the category is not selected
    } else {
      setSelected(false)
    }
  }, [location.search])

  // Turn on or off category by setting query param value in url
  const toggleCategory = (event) => {
    // If toggling is disabled, do nothing
    if (!enableToggle) return null

    // Setup & stop other click events
    event.stopPropagation()
    const uid = category._meta.uid

    // Parse query params and get array of 'category' ones
    const queryParams = queryString.parse(location.search)
    const queryCategories = getCategoryQueryParams()

    // Build set of next query params
    let nextQueryCategories = []
    // If selected, filter out this category
    if (selected && isInUrl()) {
      nextQueryCategories = queryCategories.filter(
        (queryCategory) => queryCategory !== uid
      )
      // If not selected, add to the list
    } else {
      nextQueryCategories = [...queryCategories, uid]
    }

    // Build new object of query params
    const nextQueryParams = { ...queryParams, category: nextQueryCategories }
    // Turn object into string of query params
    const nextQueryString = Object.entries(nextQueryParams)
      .map(([qpKey, qpList]) => qpList.map((qpValue) => `${qpKey}=${qpValue}`))
      .flat()
      .join("&")

    // Push new url by replacing the current one
    return navigate(`/blog${nextQueryString ? "?" : ""}${nextQueryString}`, {
      replace: true,
    })
  }

  if (enableToggle) {
    return (
      <button
        className={`btn btn-lg ${selected ? "btn-primary" : ""}`}
        onClick={toggleCategory}
      >
        {category.name}
      </button>
    )
  }

  return (
    <span
      className={`label ${selected ? "label-secondary" : ""}`}
      onClick={toggleCategory}
    >
      {category.name}
    </span>
  )
}

function AllCategory({ enableToggle = false }) {
  // Get router location hook
  const location = useLocation()

  // Get list of query param values from 'category' query params
  const getCategoryQueryParams = () => {
    const queryParams = queryString.parse(location.search)
    const queryCategories = toArray(queryParams.category)

    return queryCategories
  }

  // Set default selected state
  const [selected, setSelected] = useState(getCategoryQueryParams().length == 0)

  // Change selected state on query param state
  useEffect(() => {
    // If there no categories are selected, turn on
    if (getCategoryQueryParams().length == 0) {
      setSelected(true)
      // If categories are not selected, turn off
    } else {
      setSelected(false)
    }
  }, [location.search])

  // Remove all 'category' query params
  const clearCategories = (event) => {
    // If toggling is disabled, do nothing
    if (!enableToggle) return null

    // Stop other click events
    event.stopPropagation()

    // Parse query params and get array of 'category' ones
    const queryParams = queryString.parse(location.search)
    const { category, ...restQueryParams } = queryParams || {}

    // Turn object into string of query params
    const nextQueryString = Object.entries(restQueryParams)
      .map(([qpKey, qpList]) => qpList.map((qpValue) => `${qpKey}=${qpValue}`))
      .flat()
      .join("&")

    // Push new url by replacing the current one
    return navigate(`/blog${nextQueryString ? "?" : ""}${nextQueryString}`, {
      replace: true,
    })
  }

  if (enableToggle) {
    return (
      <button
        className={`btn btn-lg ${selected ? "btn-primary" : ""}`}
        onClick={clearCategories}
      >
        All
      </button>
    )
  }

  return (
    <span
      className={`label ${selected ? "label-secondary" : ""}`}
      onClick={clearCategories}
    >
      All
    </span>
  )
}

export default function Categories({
  categories,
  displayAll = false,
  enableToggle = false,
}) {
  // Return if no categories passed in
  if (!categories) return null

  return (
    <div className={`categories ${enableToggle ? "btn-group" : ""}`}>
      {displayAll && <AllCategory enableToggle={enableToggle} />}
      {categories.map((category) => {
        // Get category object despite hows it's passe din
        category = category.node || category.category
        // Return if category object not found
        if (!category) return null

        return (
          <Category
            category={category}
            defaultSelected={displayAll}
            enableToggle={enableToggle}
            key={category._meta.uid}
          />
        )
      })}
    </div>
  )
}
