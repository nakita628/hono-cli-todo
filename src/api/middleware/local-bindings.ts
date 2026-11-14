import type { MiddlewareHandler } from 'hono'
import type * as MiniflareModule from 'miniflare'

import type { AppEnv } from '@/api/lib'

/**
 * `hono request ... src/api/index.ts`（Node 上で env なしに `app.request()`）のときだけ、
 * Miniflare で `.cloudflare/state` のローカル D1 を開いて `c.env.DB` に入れる。
 * Workers ランタイム（本番 / `pnpm dev`）では何もしない。
 *
 * D1 id と compatibilityDate は `cloudflare.config.ts` と揃えること。
 */
export const localBindings: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (navigator.userAgent === 'Cloudflare-Workers') return next()

  // `hono request` はアプリを data: URL で import するため bare specifier が解決できない。
  // cwd 起点の require で node_modules の miniflare を読む。
  const { createRequire } = await import('node:module')
  const process = await import('node:process')
  const cwd = process.cwd()
  const { Miniflare, convertV4MiniflareOptions }: typeof MiniflareModule = createRequire(`${cwd}/`)(
    'miniflare',
  )

  const mf = new Miniflare(
    convertV4MiniflareOptions({
      modules: true,
      script: 'export default {}',
      compatibilityDate: '2026-06-18',
      d1Databases: { DB: '00000000000000000000000000000000' },
      resourcePersistencePath: `${cwd}/.cloudflare/state/v3`,
    }),
  )
  try {
    c.env = { DB: await mf.getD1Database('DB') }
    await next()
  } finally {
    await mf.dispose()
  }
}
