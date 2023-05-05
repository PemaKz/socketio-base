const redis = require('redis');
let client;

async function createRedisClient() {
  client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }
  });
  client.on('connect', () => console.log('Redis Client Connected'));
  client.on('error', err => console.log('Redis Client Error', err));
  client.on('end', () => handleDisconnect());
  await client.connect();
  return client;
}

createRedisClient();

module.exports = client

