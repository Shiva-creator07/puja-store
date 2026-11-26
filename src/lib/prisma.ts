import { PrismaClient } from "@prisma/client";

// Neon's free database goes to sleep after a few minutes without traffic.
// The first request after that can fail while it wakes up, so connection
// errors are retried a few times before giving up.

// "Can't reach the database": the query never ran, so it is always safe to retry.
const CONNECT_CODES = new Set(["P1001", "P1002"]);
// "Connection closed or timed out": only retried for reads, never for writes.
const READ_RETRY_CODES = new Set(["P1008", "P1017"]);
const READS = new Set([
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
]);
const MAX_ATTEMPTS = 4;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorCode(e: unknown): string | undefined {
  const err = e as { code?: unknown; errorCode?: unknown };
  const code = err.code ?? err.errorCode;
  return typeof code === "string" ? code : undefined;
}

function createClient() {
  return new PrismaClient().$extends({
    query: {
      async $allOperations({ operation, args, query }) {
        for (let attempt = 1; ; attempt++) {
          try {
            return await query(args);
          } catch (e) {
            const code = errorCode(e);
            const retryable =
              code !== undefined &&
              (CONNECT_CODES.has(code) ||
                (READ_RETRY_CODES.has(code) && READS.has(operation)));
            if (!retryable || attempt >= MAX_ATTEMPTS) throw e;
            await sleep(attempt * 1500);
          }
        }
      },
    },
  });
}

type ExtendedClient = ReturnType<typeof createClient>;

const globalForPrisma = globalThis as unknown as { prisma?: ExtendedClient };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}