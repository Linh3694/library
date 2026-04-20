/**
 * Simple localStorage-based cache utility with TTL (Time To Live)
 */

interface CacheItem<T> {
    value: T;
    expiry: number;
}

const DEFAULT_TTL = 3600000; // 1 hour in milliseconds

export const cache = {
    /**
     * Set a value in the cache
     * @param key Cache key
     * @param value Value to store
     * @param ttl Time To Live in milliseconds (default: 1 hour)
     */
    set: <T>(key: string, value: T, ttl: number = DEFAULT_TTL): void => {
        const item: CacheItem<T> = {
            value,
            expiry: Date.now() + ttl,
        };
        try {
            localStorage.setItem(key, JSON.stringify(item));
        } catch (e) {
            console.warn('Failed to save to localStorage cache:', e);
        }
    },

    /**
     * Get a value from the cache
     * @param key Cache key
     * @returns The cached value or null if not found or expired
     */
    get: <T>(key: string): T | null => {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        try {
            const item: CacheItem<T> = JSON.parse(itemStr);
            if (Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return item.value;
        } catch (e) {
            console.warn('Failed to parse localStorage cache item:', e);
            return null;
        }
    },

    /**
     * Remove an item from the cache
     * @param key Cache key
     */
    remove: (key: string): void => {
        localStorage.removeItem(key);
    },

    /**
     * Clear all items from the cache that start with a specific prefix
     * @param prefix Prefix to clear
     */
    clear: (prefix?: string): void => {
        if (!prefix) {
            localStorage.clear();
            return;
        }

        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(prefix)) {
                localStorage.removeItem(key);
            }
        });
    },
};

export default cache;
