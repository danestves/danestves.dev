import type { CollectionConfig } from "payload/types"

import { isAdmin, isAdminFieldLevel } from "../access/is-admin"
import { isAdminOrSelf, isAdminOrSelfFieldLevel } from "../access/is-admin-or-self"

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "firstName",
          type: "text",
          required: true,
        },
        {
          name: "lastName",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      defaultValue: ["public"],
      required: true,
      access: {
        read: isAdminOrSelfFieldLevel,
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      options: ["admin", "public"],
    },
  ],
}

export default Users
