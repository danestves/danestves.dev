import type { Block } from "payload/types"

import { blockFields } from "../../fields/block-fields"

import { BlogMarkdownField } from "./field"

export const BlogMarkdown: Block = {
  slug: "blogMarkdown",
  labels: {
    singular: "Markdown",
    plural: "Markdown Blocks",
  },
  fields: [
    blockFields({
      name: "blogMarkdownFields",
      fields: [
        {
          name: "markdown",
          type: "text",
          required: true,
          admin: {
            components: {
              Field: BlogMarkdownField,
            },
          },
        },
      ],
    }),
  ],
}
