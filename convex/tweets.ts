import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("tweets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: { content: v.string(), cycleNumber: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("tweets", {
      content: args.content,
      userId,
      createdAt: Date.now(),
      cycleNumber: args.cycleNumber,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("tweets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const tweet = await ctx.db.get(args.id);
    if (!tweet || tweet.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { totalTweets: 0, todayTweets: 0 };

    const tweets = await ctx.db
      .query("tweets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const todayTweets = tweets.filter(t => t.createdAt >= todayStart).length;

    return {
      totalTweets: tweets.length,
      todayTweets,
    };
  },
});
