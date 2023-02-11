import type { Block } from "payload/types"

import { blockFields } from "../../fields/block-fields"
import richText from "../../fields/rich-text"

export const BlogContent: Block = {
  slug: "blogContent",
  fields: [
    blockFields({
      name: "blogContentFields",
      fields: [richText({}, { elements: ["ul"] })],
    }),
  ],
}
