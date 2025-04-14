import Redis from 'ioredis';
import { env } from 'bun';

class RedisHelper {
    private redisClient: Redis | null = null;
    private isConnecting: boolean = false;

    async connect(): Promise<void> {
        if (this.redisClient) return;
        if (this.isConnecting) {
            while (!this.redisClient) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            return;
        }

        this.isConnecting = true;
        this.redisClient = new Redis({
            host: env.REDIS_HOST || "127.0.0.1",
            port: parseInt(env.REDIS_PORT || "6379"),
            db: 0,
            password: env.REDIS_PASSWORD || "",
            retryStrategy(times) {
                if (times > 10) {
                    console.error("Redis connection failed after multiple attempts.");
                    return null; // Stop retrying after 10 attempts
                }
                const delay = Math.min(times * 50, 2000);
                console.warn(`Redis retry attempt ${times}, retrying in ${delay}ms`);
                return delay;
            },
            maxRetriesPerRequest: null,
        });

        this.redisClient.on('connect', () => {
            console.log('Connected to Redis, enjoy it!');
            this.isConnecting = false;
        });

        this.redisClient.on('error', (err) => {
            console.error('Failed to connect to Redis:', err);
            this.isConnecting = false;
        });
    }

    async set(key: string, data: any, ttl: number = 3600): Promise<boolean> { 
        await this.connect();
        if (!this.redisClient) return false;
        try {
            await this.redisClient.set(key, JSON.stringify(data), "EX", ttl);
            return true;
        } catch (error) {
            console.error(`Failed to set Redis data for key ${key}:`, error);
            return false;
        }
    }

    async get<T>(key: string): Promise<T | null> {
        await this.connect();
        if (!this.redisClient) return null;
        try {
            const result = await this.redisClient.get(key);
            return result ? JSON.parse(result) as T : null;
        } catch (error) {
            console.error(`Failed to get Redis data for key ${key}:`, error);
            return null;
        }
    }

    async delete(key: string): Promise<boolean> {
        await this.connect();
        if (!this.redisClient) return false;
        try {
            const result = await this.redisClient.del(key);
            return result > 0;
        } catch (error) {
            console.error(`Failed to delete Redis data for key ${key}:`, error);
            return false;
        }
    }

    async quit(): Promise<void> {
        if (this.redisClient) {
            await this.redisClient.quit();
            this.redisClient = null;
            console.log('Redis connection closed via class.');
        }
    }
}

const redisHelperInstance = new RedisHelper();
export default redisHelperInstance;