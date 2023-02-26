import type { ServerBuild } from "@remix-run/node"

export type RequestHandler = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => Promise<void>

declare module "@remix-run/express" {
  export declare function createRequestHandler({
    build,
    getLoadContext,
    mode,
  }: {
    build: ServerBuild
    getLoadContext?: any
    mode?: string
  }): RequestHandler
}

export type * from "@remix-run/express"
