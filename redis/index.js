
let redis;
const Redis = require('ioredis');

module.exports = () => {
	if (redis) {
		return redis;
	}

	return (redis = new Redis({
		port: parseInt(process.env.REDIS_PORT),
		host: process.env.REDIS_HOST,
		password: process.env.REDIS_PASSWORD,
		db: 0,
	}));
};
