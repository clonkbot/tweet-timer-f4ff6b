import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
    return sessions;
  },
});

export const start = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Deactivate any existing sessions
    const existing = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const session of existing) {
      await ctx.db.patch(session._id, { isActive: false });
    }

    return await ctx.db.insert("sessions", {
      userId,
      startedAt: Date.now(),
      isActive: true,
      currentCycle: 1,
    });
  },
});

export const stop = mutation({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const session = await ctx.db.get(args.id);
    if (!session || session.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, { isActive: false });
  },
});

export const incrementCycle = mutation({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const session = await ctx.db.get(args.id);
    if (!session || session.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, { currentCycle: session.currentCycle + 1 });
  },
});
