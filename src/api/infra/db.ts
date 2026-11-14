import { D1Client } from '@effect/sql-d1'
import * as SQLiteD1Drizzle from 'drizzle-orm/effect-d1'
import { Context, Layer } from 'effect'

export class Database extends Context.Service<
  Database,
  SQLiteD1Drizzle.EffectSQLiteD1Database & { $client: D1Client.D1Client }
>()('Database') {}

export const DatabaseLive = (d1: D1Database) =>
  Layer.effect(Database, SQLiteD1Drizzle.makeWithDefaults({})).pipe(
    Layer.provide(D1Client.layer({ db: d1 })),
  )
