// -- The HTML Serializer
// This function will be used to modify the way that a Rich Text or Title field is rendered.

const PrismicDOM = require("prismic-dom")
const Elements = PrismicDOM.RichText.Elements
const linkResolver = require("./linkResolver")

module.exports = function htmlSerializer(type, element, content, children) {
  return null

  switch (type) {
    // Don't wrap images in a <p> tag
    case Elements.image:
      return (
        '<img src="' +
        element.url +
        '" alt="' +
        element.alt +
        '" copyright="' +
        element.copyright +
        '">'
      )

    // Add a class to hyperlinks
    case Elements.hyperlink:
      const target = element.data.target
        ? 'target="' + element.data.target + '" rel="noopener"'
        : ""
      const linkUrl = PrismicDOM.Link.url(element.data, linkResolver)
      return (
        '<a className="link"' +
        target +
        ' href="' +
        linkUrl +
        '">' +
        content +
        "</a>"
      )

    // Return null to stick with the default behavior for all other elements
    default:
      return null
  }
}

//  ---------- OLD Serializer ----------
// import React from "react"
// import { Link as PrismicLink } from "prismic-reactjs"
// import { Elements } from "prismic-richtext"
// import linkResolver from "./linkResolver"
// import { Link } from "gatsby"

// export default function (type, element, content, children, index) {
//   // Generate links to Prismic Documents as <Link> components
//   if (type === Elements.hyperlink) {
//     let result = ""
//     const url = PrismicLink.url(element.data, linkResolver)

//     if (element.data.link_type === "Document") {
//       result = (
//         <Link to={url} key={index}>
//           {content}
//         </Link>
//       )
//     } else {
//       const target = element.data.target
//         ? { target: element.data.target, rel: "noopener" }
//         : {}
//       result = (
//         <a className="link" href={url} {...target} key={index}>
//           {content}
//         </a>
//       )
//     }
//     return result
//   }

//   // If the image is also a link to a Prismic Document, it will return a <Link> component
//   if (type === Elements.image) {
//     let result = (
//       <img
//         src={element.url}
//         alt={element.alt || ""}
//         copyright={element.copyright || ""}
//       />
//     )

//     if (element.linkTo) {
//       const url = PrismicLink.url(element.linkTo, linkResolver)

//       if (element.linkTo.link_type === "Document") {
//         result = (
//           <Link to={url} key={index}>
//             {result}
//           </Link>
//         )
//       } else {
//         const target = element.linkTo.target
//           ? { target: element.linkTo.target, rel: "noopener" }
//           : {}
//         result = (
//           <a className="link" href={url} {...target}>
//             {result}
//           </a>
//         )
//       }
//     }
//     const wrapperClassList = [element.label || "", "block-img"]
//     result = (
//       <p className={wrapperClassList.join(" ")} key={index}>
//         {result}
//       </p>
//     )
//     return result
//   }

//   // Return null to stick with the default behavior for everything else
//   return null
// }
