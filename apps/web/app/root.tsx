import { json } from "@remix-run/node"
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react"

import { useNonce } from "./utils/nonce-provider"

export async function loader() {
  return json({
    env: process.env,
  })
}

export default function App() {
  const nonce = useNonce()
  const data = useLoaderData()

  console.info(data)

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />

        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  )
}
