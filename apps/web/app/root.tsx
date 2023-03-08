import type { LinkDescriptor } from "@remix-run/node"

import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"

import tailwindStyles from "./styles/tailwind.css"
import { useIsBot } from "./utils/is-bot-provider"
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
  const isBot = useIsBot()
  const nonce = useNonce()

  return (
    <html className="h-full" lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="relative z-[1] h-full bg-[#040404] before:absolute before:inset-0 before:z-[-1] before:bg-[linear-gradient(90.25deg,_#040404_0.19%,_#161616_93.23%)] before:opacity-0 before:transition-opacity before:duration-500 before:ease-linear lg:before:opacity-100">
        <Outlet />

        <ScrollRestoration nonce={nonce} />
        {!isBot ? <Scripts nonce={nonce} /> : null}
        <LiveReload nonce={nonce} />
      </body>
    </html>
  )
}
