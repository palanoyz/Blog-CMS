/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import pg from "pg";

declare global {
  var _prisma: PrismaClient | undefined;
}

function getPrismaClient(): PrismaClient {
  if (global._prisma) return global._prisma;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }

  const pool = new pg.Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    global._prisma = client;
  }

  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrismaClient() as any)[prop];
  },
});

