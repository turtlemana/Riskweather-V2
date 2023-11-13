// redis.ts
import { getClient } from './ioredisClient';
import { Redis } from 'ioredis';

const client = getClient();

export const subscribe = (channel: string, callback: (message: string) => void) => {
    const subscriber = new Redis();
    subscriber.subscribe(channel);
    subscriber.on("message", (channel, message) => callback(message));
};

export const publish = async (channel: string, message: string) => {
    await client.publish(channel, message);
};

export const setValue = async (key: string, field: string, value: any, expirationTime?: number) => {
    try {
        if (expirationTime) {
            await client.setex(key, expirationTime, JSON.stringify(value));
        } else {
            await client.hset(key, field, JSON.stringify(value));
        }

        await publish('user-update', field);

        return value;
    } catch (error) {
        console.error('Error setting value in Redis:', error);
        throw error;
    }
};

export const setExValue = async (key: string, expirationTime: number, value: any) => {
    try {
        await client.setex(key, expirationTime, JSON.stringify(value));

        return value;
    } catch (error) {
        console.error('Error setting value in Redis:', error);
        throw error;
    }
}

export const getExValue = async (key: string) => {
    try {
        const res: string | null = await client.get(key);
        if (res) {
            return JSON.parse(res);
        }
        return null;
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error('Error parsing Redis response:', error);
        } else {
            console.error('Error getting value from Redis:', error);
        }
        throw error;
    }
}

export const getValue = async (key: string, field: string) => {
    try {
        const res: string | null = await client.hget(key, field);
        if (res) {
            return JSON.parse(res);
        }
        return null;
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error('Error parsing Redis response:', error);
        } else {
            console.error('Error getting value from Redis:', error);
        }
        throw error;
    }
};

export const deleteExValue = async (key: string) => {
    try {
        await client.del(key);
    } catch (error) {
        console.error('Error deleting value from Redis:', error);
        throw error;
    }
};
export const deleteValue = async (key: string, field: string) => {
    try {
        await client.hdel(key, field);
    } catch (error) {
        console.error('Error deleting value from Redis:', error);
        throw error;
    }
};

export const existValue = async (key: string, field: string) => {
    try {
        const result = await client.hexists(key, field);
        return result === 1;
    } catch (error) {
        console.error('Error checking if value exists in Redis:', error);
        throw error;
    }
};

export const checkRateLimit = async (ip: string) => {
    const key = `rateLimit:${ip}`;
    const current = await client.get(key) || 0;

    if (Number(current) >= 5) {
        return false;
    }

    await client.incr(key);
    await client.expire(key, 3600);

    return true;
};




process.on('exit', () => {
    client?.disconnect();
});