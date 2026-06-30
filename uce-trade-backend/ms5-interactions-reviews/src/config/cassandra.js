const cassandra = require('cassandra-driver');
require('dotenv').config();

// ✅ FIX: Read from environment variable with fallback
const contactPoint = process.env.CASSANDRA_HOST || '127.0.0.1';

console.log(`🔄 Connecting to Cassandra at: ${contactPoint}`);

const client = new cassandra.Client({
  contactPoints: [contactPoint],
  localDataCenter: 'datacenter1',
});

const initDB = async () => {
  try {
    await client.execute(`
      CREATE KEYSPACE IF NOT EXISTS uce_trade_reviews 
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}
    `);
    
    client.keyspace = 'uce_trade_reviews';

    await client.execute(`
      CREATE TABLE IF NOT EXISTS uce_trade_reviews.reviews (
        id uuid,
        venture_id text,
        user_id text,
        user_name text,
        user_avatar text,
        rating int,
        comment text,
        created_at timestamp,
        PRIMARY KEY (venture_id, created_at, id)
      ) WITH CLUSTERING ORDER BY (created_at DESC);
    `);
    
    console.log('✅ Cassandra DB connected and "reviews" table ready.');
  } catch (error) {
    console.error('❌ Error initializing Cassandra:', error);
    // ✅ FIX: Don't crash the app if Cassandra is not ready
    console.log('⚠️ Cassandra not available. Will retry connection...');
  }
};

module.exports = { client, initDB };