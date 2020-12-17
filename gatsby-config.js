const { apiEndpoint } = require("./prismic-config")
var repo = /([^\/]+)\.cdn\.prismic\.io/.exec(apiEndpoint)[1]

module.exports = {
  siteMetadata: {
    title: `SIMBS`,
    keywords: `mountain, bike, biking, mtb, south, vancouver, island, riding`,
    description: `Home of the South Island Mountain Bike Society`,
    author: `Brendon Earl (@bndnio)`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `@prismicio/gatsby-source-prismic-graphql`,
      options: {
        repositoryName: repo, // Loads the repo name from prismic configuration
        path: "/preview",
        previews: true,
        pages: [
          {
            type: "Post",
            match: "/news/:uid",
            path: "/news",
            component: require.resolve("./src/templates/post.js"),
          },
        ],
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-plugin-eslint",
      options: {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|.cache|public)/,
        stages: ["develop"],
        options: {
          emitWarning: true,
          failOnError: false,
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
  ],
}
