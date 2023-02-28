/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    unstable_postcss: true,
    unstable_tailwind: true,
    v2_routeConvention: true,
  },
  ignoredRouteFiles: ["**/.*"],
  assetsBuildDirectory: "public/web/build",
  publicPath: "/web/build/",
}
