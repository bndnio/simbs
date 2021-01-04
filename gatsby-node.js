const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Query all Posts with their IDs and template data.
  const pages = await graphql(`
    {
      allPrismicPost {
        nodes {
          uid
        }
      }
    }
  `)

  const pageTemplates = {
    post: path.resolve(__dirname, "src/templates/post.js"),
  }

  // Create pages for each Post in Prismic
  pages.data.allPrismicPost.nodes.forEach((node) => {
    createPage({
      path: `/news/${node.uid}`,
      component: pageTemplates.post,
      context: {
        id: node.id,
      },
    })
  })
}
