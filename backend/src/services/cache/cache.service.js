import redisClient from  "../../config/redis.js"

const DEFAULT_TTL = Number(
    process.env.REDIS_SEARCH_TTL || 300
);

export const setCache = async (
    key,
    value,
    ttl = DEFAULT_TTL
) => {
    try {
        await redisClient.set(
            key,
            JSON.stringify(value),
            {
                EX: ttl
            }
        );

        console.log(`Redis SET: ${key}`);
    } catch (error) {
        console.error("Redis SET error:", error);
    }
};


export const getCache = async (key) => {
    try {
        const value = await redisClient.get(key);

        if (!value) {
            console.log(`Redis MISS: ${key}`);
            return null;
        }

        console.log(`Redis HIT: ${key}`);

        return JSON.parse(value);

    } catch (error) {
        console.error("Redis GET error:", error);
        return null;
    }
};


export const deleteCache = async (key) => {
    try {
        await redisClient.del(key);

        console.log(`Redis DELETE: ${key}`);

    } catch (error) {
        console.error("Redis DELETE error:", error);
    }
};