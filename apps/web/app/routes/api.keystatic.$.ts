import type { LoaderArgs } from "@remix-run/node"

import { handleLoader } from "@keystatic/remix/api"

import config from "keystatic.config"

export async function loader(args: LoaderArgs) {
  return handleLoader({ config }, args)
}
