/** @type { import("drizzle-kit").Config } */
export default {
  schema: './server/db/schema.js',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || 'file:server/data/liceo.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
};
