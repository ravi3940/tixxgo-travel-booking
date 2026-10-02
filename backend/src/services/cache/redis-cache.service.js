import redisClient from "../../config/redis.js";

const DEFAULT_TTL = Number(
    process.env.REDIS_SEARCH_TTL || 300
);

const setCache = async (key, value, ttl = DEFAULT_TTL) => {

    await redisClient.set(
        key,
        JSON.stringify(value),
        {
            EX: ttl
        }
    );
};


const getCache = async (key) => {

    const value = await redisClient.get(key);

    if (!value) {
        return null;
    }

    return JSON.parse(value);
};


const deleteCache = async (key) => {

    await redisClient.del(key);
};


export {
    setCache,
    getCache,
    deleteCache
};