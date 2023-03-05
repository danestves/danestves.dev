import { collection, config, fields, singleton } from "@keystatic/core"

export default config({
  storage: {
    kind: "github",
    repo: { owner: "danestves", name: "danestves.dev" },
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
          },
          slug: {
            label: "Slug",
          },
        }),
        publishDate: fields.date({ label: "Publish Date" }),
        heroImage: fields.image({ label: "Hero Image" }),
        content: fields.document({
          label: "Content",
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
  },
})
