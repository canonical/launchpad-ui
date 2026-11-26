import postgres from "postgres";
import {
  DATABASE_SSL_MODE,
  POSTGRESQL_DB_CONNECT_STRING,
} from "$app/env/private";

// TODO: Always create the client once the connection string is required (https://warthogs.atlassian.net/browse/LP-5243)
export const sql = POSTGRESQL_DB_CONNECT_STRING
  ? postgres(POSTGRESQL_DB_CONNECT_STRING, {
      ssl: DATABASE_SSL_MODE === "require" ? "require" : false,
    })
  : null;
