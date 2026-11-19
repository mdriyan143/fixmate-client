import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: (process.env.TRUSTED_ORIGINS || "").split(",").filter(Boolean),
  emailAndPassword: { enabled: true, minPasswordLength: 6 },

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
