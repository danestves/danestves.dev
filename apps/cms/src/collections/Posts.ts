import type { CollectionConfig } from "payload/types"

import { isAdmin } from "../access/is-admin"
import { publishedOnly } from "../access/published-only"
import { Banner } from "../blocks/banner"
import { BlogContent } from "../blocks/blog-content"
import { BlogMarkdown } from "../blocks/blog-markdown"
import { Code } from "../blocks/code"
import { MediaBlock } from "../blocks/media"
import richText from "../fields/rich-text"
import { slugField } from "../fields/slug"

const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
  },
  access: {
    create: isAdmin,
    read: publishedOnly,
    readVersions: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    richText({
      name: "excerpt",
    }),
    {
      name: "content",
      type: "blocks",
      blocks: [Banner, BlogContent, Code, BlogMarkdown, MediaBlock],
      required: true,
    },
    slugField(),
    {
      name: "publishedOn",
      type: "date",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
  ],
}

export default Posts
