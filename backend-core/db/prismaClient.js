require("dotenv").config();
require("dotenv").config({ path: "prisma/.env", override: false });

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis;

const prismaClient =
  globalForPrisma.prismaClient ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaClient = prismaClient;
}

module.exports = prismaClient;
