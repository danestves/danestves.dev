import type { HandleDocumentRequestFunction } from "@remix-run/node"

import { PassThrough } from "stream"

import { Response } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import isbot from "isbot"
import { renderToPipeableStream } from "react-dom/server"

import { IsBotProvider } from "./utils/is-bot-provider"
import { NonceProvider } from "./utils/nonce-provider"

const ABORT_DELAY = 5000

// NOTE: we've got a patch-package on Remix that adds the loadContext argument
// so we can access the cspNonce in the entry. Hopefully this gets supported:
// https://github.com/remix-run/remix/discussions/4603
type DocRequestArgs = Parameters<HandleDocumentRequestFunction>

export default function handleRequest(...args: DocRequestArgs) {
  const [request, responseStatusCode, responseHeaders, remixContext, loadContext] = args
  const callbackName = isbot(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady"
  const nonce = loadContext.cspNonce ? String(loadContext.cspNonce) : undefined

  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <IsBotProvider value={isbot(request.headers.get("User-Agent"))}>
        <NonceProvider value={nonce}>
          <RemixServer abortDelay={ABORT_DELAY} context={remixContext} url={request.url} />
        </NonceProvider>
      </IsBotProvider>,
      {
        [callbackName]: () => {
          const body = new PassThrough()

          responseHeaders.set("Content-Type", "text/html")

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          )

          pipe(body)
        },
        onShellError: (err: unknown) => {
          reject(err)
        },
        onError: (error: unknown) => {
          didError = true

          console.error(error)
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
