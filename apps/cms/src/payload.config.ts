import path from "path"

import { buildConfig } from "payload/config"

import { Media } from "./collections/Media"
import Posts from "./collections/Posts"
import Users from "./collections/Users"

export default buildConfig({
  admin: {
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "react": path.resolve(__dirname, "../node_modules/react"),
          "react-dom": path.resolve(__dirname, "../node_modules/react-dom"),
          "react-router-dom": path.resolve(__dirname, "../node_modules/react-router-dom"),
        },
      },
    }),
  },
  collections: [Media, Posts, Users],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
})
