import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
  if (!_db) {
    const url = process.env.POSTGRES_URL;
    if (!url) {
      throw new Error("POSTGRES_URL environment variable is not set");
    }
    const client = postgres(url, { prepare: false });
    _db = drizzle(client, { schema, casing: "snake_case" });
  }
  return _db;
};

// Keep `db` as a getter for backward compatibility
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});
