const {Queue} = require('bullmq');

const connectionInfo = { connection : {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  }
}}

// const SampleQueu = new Queue('SampleQueu', connectionInfo);

module.exports = {
  connectionInfo,
  // SampleQueu
}
