// -- The Link Resolver
// This function will be used to generate links to Prismic documents
// As your project grows, you should update this function according to your routes

module.exports = function linkResolver(doc) {
  // Route for blog posts
  if (doc.type === "post") {
    return "/news/" + doc.uid
  }

  // Homepage route fallback
  return "/"
}
