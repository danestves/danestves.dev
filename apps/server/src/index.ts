import fs from "node:fs"
import path from "node:path"

import { payload } from "@danestves/cms"
import { createRequestHandler } from "@danestves/web/express"
import compression from "compression"
import express from "express"
import promBundle from "express-prom-bundle"
import morgan from "morgan"
import onFinished from "on-finished"
import serverTiming from "server-timing"

import { getRedirectsMiddleware } from "./redirects"

const here = (...d: Array<string>) => path.join(__dirname, ...d)
const primaryHost = "danestves.com"
const getHost = (req: { get: (key: string) => string | undefined }) =>
  req.get("X-Forwarded-Host") ?? req.get("host") ?? ""

const MONGODB_URL = process.env.MONGODB_URL ?? ""
const PAYLOADCMS_SECRET = process.env.PAYLOADCMS_SECRET ?? ""
const ENVIRONMENT = process.env.NODE_ENV

let WEB_BUILD_DIR: string
let WEB_PUBLIC_DIR: string
let WEB_PUBLIC_BUILD_DIR: string

if (ENVIRONMENT === "production") {
  WEB_BUILD_DIR = path.join(process.cwd(), "apps/web/build")
  WEB_PUBLIC_DIR = path.join(process.cwd(), "apps/web/public/web")
  WEB_PUBLIC_BUILD_DIR = path.join(process.cwd(), "apps/web/public/web/build")
} else {
  WEB_BUILD_DIR = path.join(process.cwd(), "../web/build")
  WEB_PUBLIC_DIR = path.join(process.cwd(), "../web/public/web")
  WEB_PUBLIC_BUILD_DIR = path.join(process.cwd(), "../web/public/web/build")
}

async function start() {
  const app = express()
  const metricsApp = express()
  app.use(
    promBundle({
      includeMethod: true,
      includePath: true,
      includeStatusCode: true,
      includeUp: true,
      metricsPath: "/metrics",
      promClient: {
        collectDefaultMetrics: {},
      },
      metricsApp,
    }),
  )

  app.use(serverTiming())

  app.use(async (req, res, next) => {
    res.set("X-Powered-By", "danestves LLC")
    res.set("X-Fly-Region", process.env.FLY_REGION ?? "unknown")
    res.set("X-Fly-App", process.env.FLY_APP_NAME ?? "unknown")
    res.set("X-Frame-Options", "SAMEORIGIN")

    const host = getHost(req)
    if (!host.endsWith(primaryHost)) {
      res.set("X-Robots-Tag", "noindex")
    }
    res.set("Access-Control-Allow-Origin", `https://${host}`)

    // if they connect once with HTTPS, then they'll connect with HTTPS for the next hundred years
    res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`)
    next()
  })

  app.use(async (req, res, next) => {
    if (req.get("cf-visitor")) {
      // console.log(`👺 disallowed cf-visitor`, req.headers) // <-- this can be kinda noisy
      // make them wait for it... Which should cost them money...
      await new Promise((resolve) => setTimeout(resolve, 90_000))
      return res.send("Please go to https://kcd.dev instead! Ping Kent if you think you should not be seeing this...")
    } else {
      return next()
    }
  })

  app.use((req, res, next) => {
    const proto = req.get("X-Forwarded-Proto")
    const host = getHost(req)
    if (proto === "http") {
      res.set("X-Forwarded-Proto", "https")
      res.redirect(`https://${host}${req.originalUrl}`)
      return
    }
    next()
  })

  app.all(
    "*",
    getRedirectsMiddleware({
      redirectsString: fs.readFileSync(here("./_redirects.txt"), "utf8"),
    }),
  )

  app.use((req, res, next) => {
    if ((req.path.endsWith("/") || req.path.endsWith("admin/")) && req.path.length > 1) {
      const query = req.url.slice(req.path.length)
      const safepath = req.path.slice(0, -1).replace(/\/+/g, "/")
      res.redirect(301, safepath + query)
    } else {
      next()
    }
  })

  app.use(compression())

  // Serving the web static files with different caching strategies
  app.use(
    "/web/build",
    express.static(WEB_PUBLIC_BUILD_DIR, {
      immutable: true,
      maxAge: "1y",
      redirect: false,
    }),
  )
  app.use("/web", express.static(WEB_PUBLIC_DIR, { maxAge: "1h", redirect: false }))

  // log the referrer for 404s
  app.use((req, res, next) => {
    onFinished(res, () => {
      const referrer = req.get("referer")
      if (res.statusCode === 404 && referrer) {
        console.info(`👻 404 on ${req.method} ${req.path} referred by: ${referrer}`)
      }
    })
    next()
  })

  app.use(
    morgan((tokens, req, res) => {
      const host = getHost(req)
      return [
        tokens.method?.(req, res),
        `${host}${tokens.url?.(req, res)}`,
        tokens.status?.(req, res),
        tokens.res?.(req, res, "content-length"),
        "-",
        tokens["response-time"]?.(req, res),
        "ms",
      ].join(" ")
    }),
  )

  await payload.init({
    express: app,
    mongoURL: MONGODB_URL,
    secret: PAYLOADCMS_SECRET,
    onInit: () => {
      payload.logger.info(`🐰 Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  app.use(payload.authenticate)

  app.all(
    "*",
    ENVIRONMENT === "development"
      ? (req, res, next) => {
          purgeRequireCache()

          return createRequestHandler({
            build: require(WEB_BUILD_DIR),
            mode: ENVIRONMENT,
            getLoadContext(req, res) {
              return {
                payload: req.payload,
                user: req?.user,
                res,
              }
            },
          })(req, res, next)
        }
      : createRequestHandler({
          build: require(WEB_BUILD_DIR),
          mode: ENVIRONMENT,
          getLoadContext(req, res) {
            return {
              payload: req.payload,
              user: req?.user,
              res,
            }
          },
        }),
  )

  const port = process.env.PORT || 3000

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`)
  })
}

start()

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default

  for (const key in require.cache) {
    if (key.startsWith(WEB_BUILD_DIR)) {
      delete require.cache[key]
    }
  }
}
