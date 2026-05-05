import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

type Result = { success: boolean; limit: number; remaining: number; reset: number };

let cached: Ratelimit | null | undefined;

function getLimiter(): Ratelimit | null {
  if (cached !== undefined) return cached;
  const hasKv =
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  if (!hasKv) {
    cached = null;
    return cached;
  }
  const redis = new Redis({
    url: (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL)!,
    token: (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN)!,
  });
  cached = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "mtosity-tools-instagram",
    analytics: true,
  });
  return cached;
}

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anonymous";
}

export async function checkRateLimit(req: NextRequest): Promise<Result> {
  const limiter = getLimiter();
  if (!limiter) {
    return { success: true, limit: Infinity, remaining: Infinity, reset: 0 };
  }
  const ip = getIp(req);
  const { success, limit, remaining, reset } = await limiter.limit(ip);
  return { success, limit, remaining, reset };
}
