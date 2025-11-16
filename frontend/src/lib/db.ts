import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: mvp_worker,
  },
  eh: {
    mainModule: duckdb_wasm_eh,
    mainWorker: eh_worker,
  },
};

let connInstance: duckdb.AsyncDuckDBConnection | null = null;

export async function initDB(): Promise<duckdb.AsyncDuckDBConnection> {
  if (connInstance) return connInstance;

  const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
  const worker = new Worker(bundle.mainWorker!);
  const logger = new duckdb.ConsoleLogger();
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule);

  connInstance = await db.connect();

  await createSchema(connInstance);

  return connInstance;
}

async function createSchema(conn: duckdb.AsyncDuckDBConnection): Promise<void> {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS people (
      id VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      age INTEGER NOT NULL,
      occupation VARCHAR NOT NULL,
      home_address VARCHAR NOT NULL,
      financial_status VARCHAR,
      psychological_profile VARCHAR
    );
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS locations (
      id VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      type VARCHAR NOT NULL,
      address VARCHAR NOT NULL
    );
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS timeline_events (
      id VARCHAR PRIMARY KEY,
      person_id VARCHAR NOT NULL,
      timestamp TIMESTAMP NOT NULL,
      location_id VARCHAR NOT NULL,
      activity VARCHAR NOT NULL,
      witnesses VARCHAR[],
      evidence_ids VARCHAR[],
      verified BOOLEAN DEFAULT FALSE,
      source VARCHAR NOT NULL
    );
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS relationships (
      id VARCHAR PRIMARY KEY,
      person_a VARCHAR NOT NULL,
      person_b VARCHAR NOT NULL,
      relationship_type VARCHAR NOT NULL,
      strength DOUBLE NOT NULL,
      secrets VARCHAR[]
    );
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS evidence (
      id VARCHAR PRIMARY KEY,
      type VARCHAR NOT NULL,
      location_id VARCHAR NOT NULL,
      description TEXT NOT NULL,
      collected_at TIMESTAMP,
      analyzed BOOLEAN DEFAULT FALSE,
      analysis_results TEXT,
      requires_warrant BOOLEAN DEFAULT FALSE,
      warrant_granted BOOLEAN DEFAULT TRUE
    );
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS interviews (
      id VARCHAR PRIMARY KEY,
      person_id VARCHAR NOT NULL,
      timestamp TIMESTAMP NOT NULL,
      questions_answers JSON NOT NULL,
      stress_level INTEGER NOT NULL
    );
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS game_state (
      id INTEGER PRIMARY KEY,
      victim_id VARCHAR NOT NULL,
      case_opened TIMESTAMP NOT NULL,
      current_day INTEGER DEFAULT 1,
      budget_remaining DECIMAL DEFAULT 50000,
      reputation INTEGER DEFAULT 50,
      case_solved BOOLEAN DEFAULT FALSE,
      accused_person_id VARCHAR
    );
  `);
}

export async function getDB(): Promise<duckdb.AsyncDuckDBConnection> {
  if (!connInstance) {
    return await initDB();
  }
  return connInstance;
}

export async function query<T = any>(sql: string): Promise<T[]> {
  const conn = await getDB();
  const result = await conn.query(sql);
  return result.toArray().map(row => row.toJSON() as T);
}

export async function execute(sql: string): Promise<void> {
  const conn = await getDB();
  await conn.query(sql);
}
