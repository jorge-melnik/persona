import pg from "pg";

// const { PoolConfig } = pg;
// const PGOPTIONS: PoolConfig = {
//   user: process.env.POSTGIS_USER,
//   host: process.env.PGHOST,
//   database: process.env.POSTGIS_DATABASE,
//   password: process.env.POSTGIS_PASSWORD,
//   port: parseInt(process.env.PGPORT || "5432"),
//   parseInputDatesAsUTC: false,
// connectionString?: string, // e.g. postgres://user:password@host:5432/database
// ssl?: any, // passed directly to node.TLSSocket, supports all tls.connect options
// types?: any, // custom type parsers
// statement_timeout?: number, // number of milliseconds before a statement in query will time out, default is no timeout
// query_timeout?: number, // number of milliseconds before a query call will timeout, default is no timeout
// application_name?: string, // The name of the application that created this Client instance
// connectionTimeoutMillis?: number, // number of milliseconds to wait for connection, default is no timeout
// idle_in_transaction_session_timeout?: number // number of milliseconds before terminating any session with an open idle transaction, default is no timeout
// };

const { Pool } = pg;

const pool = new Pool();

const query = async (
  text: string,
  params?: (number | string | number[] | string[])[]
) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};

export default {
  query,
  valor: 3,
};
