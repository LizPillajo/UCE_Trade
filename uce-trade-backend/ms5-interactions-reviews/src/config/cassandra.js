// src/config/cassandra.js
const cassandra = require('cassandra-driver');
require('dotenv').config();

// Conection no keyspace to create it
const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_HOST || '127.0.0.1'],
  localDataCenter: 'datacenter1',
});

const initDB = async () => {
  try {
    // 1. Create the Keyspace (Base de datos en Cassandra)
    await client.execute(`
      CREATE KEYSPACE IF NOT EXISTS uce_trade_reviews 
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}
    `);
    
    // Change the client so that it points to the newly created keyspace
    client.keyspace = 'uce_trade_reviews';

    // 2. Create the Reviews Table
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
  }
};

module.exports = { client, initDB };