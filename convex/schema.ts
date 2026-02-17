import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  tweets: defineTable({
    content: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
    cycleNumber: v.number(),
  }).index("by_user", ["userId"]).index("by_user_and_cycle", ["userId", "cycleNumber"]),
  sessions: defineTable({
    userId: v.id("users"),
    startedAt: v.number(),
    isActive: v.boolean(),
    currentCycle: v.number(),
  }).index("by_user", ["userId"]),
});
