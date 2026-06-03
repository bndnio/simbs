// -- The Link Resolver
// This function will be used to generate links to Prismic documents
// As your project grows, you should update this function according to your routes

module.exports = function linkResolver(doc) {
  if (!doc) return null

  if (doc.link_type === "Web" || doc.link_type === "Media") {
    return doc.url || null
  }

  switch (doc.type) {
    case "post":
      return doc.uid ? `/news/${doc.uid}` : "/news/"
    case "blog_home":
      return "/news/"
    case "membership_page":
      return "/membership/"
    case "about_page":
      return "/about/"
    case "advocacy_page":
      return "/advocacy/"
    case "events_page":
      return "/events/"
    case "trails_page":
      return "/trails/"
    case "home_page":
      return "/"
    default:
      return doc.url || "/"
  }
}
