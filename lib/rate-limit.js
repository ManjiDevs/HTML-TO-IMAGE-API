import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
        enableTelemetry: false,
      })
    : null;

const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(1, "10 s"),
      prefix: "html-to-image-api",
      analytics: false,
    })
  : null;

export async function checkRateLimit(identifier) {
  if (!limiter) {
    return {
      configured: false,
      success: false,
      limit: 1,
      remaining: 0,
      reset: Date.now() + 10_000,
    };
  }

  const result = await limiter.limit(identifier);

  return {
    configured: true,
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
