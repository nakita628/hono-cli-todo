/**
 * Hono の Env。`c.env` は Worker のバインディング（`cloudflare.config.ts` から生成される `Cloudflare.Env`）。
 *
 * app（`OpenAPIHono<AppEnv>`）、ミドルウェア、ハンドラ（`RouteHandler<typeof route, AppEnv>`）で共有する。
 */
export type AppEnv = { Bindings: Cloudflare.Env }
