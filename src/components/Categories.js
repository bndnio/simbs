import React from "react"

function Category({ category }) {
  return <div className="category">{category.name}</div>
}

export default function Categories({ categories }) {
  if (!categories) return null

  return (
    <div className="categories">
      {categories.map((category) => {
        category = category.node || category.category
        if (!category) return null

        return <Category category={category} key={category._meta.uid} />
      })}
    </div>
  )
}
