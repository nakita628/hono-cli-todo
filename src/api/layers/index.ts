import { Layer } from 'effect'

import { DatabaseLive } from '@/api/infra'

/**
 * アプリ全体の依存をまとめた Layer。Worker のバインディング（`c.env`）から組み立てる。
 *
 * バインディングが増えたら `Layer.mergeAll` に足していく（例: `KvLive(env.KV)`）。
 * テストでは `app.request(path, init, mockEnv)` で env を差し替えるか、
 * `Layer.succeed(Database, fakeDb)` を直接 provide する。
 *
 * ```mermaid
 * flowchart LR
 *   E["c.env"] --> A["AppLive(env)"]
 *   A --> D["DatabaseLive(env.DB)"]
 *   D --> S["Database (drizzle)"]
 * ```
 *
 * @param env - Worker のバインディング
 */
export const AppLive = (env: Cloudflare.Env) => Layer.mergeAll(DatabaseLive(env.DB))
