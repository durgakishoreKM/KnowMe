import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "neondb_owner",
  host: "ep-icy-rain-al19n04j.c-3.eu-central-1.aws.neon.tech", // ❗ no -pooler
  database: "neondb",
  password: "npg_CAvGNM69VWOp",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;