import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const ensureDailyLogForDate = mutation({
  args: {
    date: v.string(), // example: "2026-05-17"
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkUserId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User profile not found");
    }

    const existingLog = await ctx.db
      .query("dailyLog")
      .withIndex("by_clerkUserId_date", (q) =>
        q.eq("clerkUserId", clerkUserId).eq("date", args.date),
      )
      .first();

    if (existingLog) {
      return existingLog;
    }

    const dailyLogId = await ctx.db.insert("dailyLog", {
      clerkUserId,
      date: args.date,

      nutritionTargets: user.nutritionTargets,

      calories: 0,
      protienGrams: 0,
      fatGrams: 0,
      carbsGrams: 0,
      fiberGrams: 0,
      sugarGrams: 0,
      sodiumMg: 0,

      steps: 0,
      water: 0,
    });

    const newDailyLog = await ctx.db.get(dailyLogId);

    if (!newDailyLog) {
      throw new Error("Failed to create daily log");
    }

    return newDailyLog;
  },
});

export const getDailyLogsForDateRange = query({
  args: {
    startDate: v.string(), // example: "2026-05-11"
    endDate: v.string(), // example: "2026-05-17"
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkUserId = identity.subject;

    if (args.startDate > args.endDate) {
      throw new Error("startDate cannot be after endDate");
    }

    const dailyLogs = await ctx.db
      .query("dailyLog")
      .withIndex("by_clerkUserId_date", (q) =>
        q
          .eq("clerkUserId", clerkUserId)
          .gte("date", args.startDate)
          .lte("date", args.endDate),
      )
      .order("asc")
      .collect();

    return dailyLogs;
  },
});
