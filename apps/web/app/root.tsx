import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"
import { LinkDescriptor } from "@remix-run/node"

import tailwindStyles from "./styles/tailwind.css"
import { useNonce } from "./utils/nonce-provider"

export function links(): LinkDescriptor[] {
  return [
    { rel: "preload", href: "https://fonts.cdnfonts.com/css/sf-pro-display", as: "style" },
    { rel: "preload", href: tailwindStyles, as: "style" },
    { rel: "stylesheet", href: "https://fonts.cdnfonts.com/css/sf-pro-display" },
    { rel: "stylesheet", href: tailwindStyles },
  ]
}

export default function App() {
  const nonce = useNonce()

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
