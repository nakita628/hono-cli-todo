# hono-cli-todo

Hono + Effect + Cloudflare D1 の Todo アプリ（フロントエンドは React + Panda CSS）。

```bash
pnpm install
pnpm local:migrate
pnpm dev   # http://localhost:8787
```

## hono request

```bash
pnpm hono request -P /api/todos src/api/index.ts
```

各エンドポイントのリクエスト例は [api.md](api.md) を参照（Hono Request Runner 拡張の ▶ Send で実行できる）。
