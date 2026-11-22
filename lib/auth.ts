import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

const client =
  globalForMongo.mongoClient ??
  new MongoClient(process.env.MONGODB_URI as string, { maxPoolSize: 10 });

globalForMongo.mongoClient = client;

const db = client.db(process.env.DB_NAME);

// Google login is switched on only when both keys exist, so a missing key cannot break the app
const googleReady = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  // spaces and a last "/" are removed, so a small typo cannot break login
  trustedOrigins: (process.env.TRUSTED_ORIGINS || "")
    .split(",")
    .map((url) => url.trim().replace(/\/+$/, ""))
    .filter(Boolean),
  emailAndPassword: { enabled: true, minPasswordLength: 6 },

  // Google login: BetterAuth uses these two keys
  ...(googleReady
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        },
      }
    : {}),

  // BetterAuth's user collection IS our "users" collection
  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", defaultValue: "customer", input: true },
      phone: { type: "string", required: false },
      area: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },

  // runs before every auth request: the server-side copy of the sign-up password rules
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const password = String(ctx.body?.password ?? "");
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password needs at least one uppercase and one lowercase letter",
        });
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        // anything except customer/technician is saved as customer (nobody signs up as admin)
        before: async (user) => ({
          data: { ...user, role: user.role === "technician" ? "technician" : "customer" },
        }),
      },
      update: {
        // role can never be changed from the browser, only by the admin API on the server
        before: async (data) => {
          if ("role" in data) return false;
        },
      },
    },
  },

  plugins: [
    jwt({ jwt: { definePayload: ({ user }) => ({ id: user.id, email: user.email }) } }),
    nextCookies(),
  ],
});
