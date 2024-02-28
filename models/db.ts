import { Pool } from "pg";

let globalPool: Pool;

export function getDb() {
  if (!globalPool) {
    const connectionString = process.env.POSTGRES_URL;
    //  const connectionString =
      //  "postgres://postgres:123456@127.0.0.1:5432/postgres";
    console.log("connectionString", connectionString);

    globalPool = new Pool({
      connectionString,
    });
  }

  return globalPool;
}
