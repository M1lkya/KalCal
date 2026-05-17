import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const hasUserCompletedOnboarding = query({
  args: {},

  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    // Not signed in
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_convexUserId", (q) =>
        q.eq("convexUserId", identity.subject),
      )
      .first();

    return user !== null;
  },
});

export const createUser = mutation({
  args: {
    age: v.string(),

    heightCm: v.number(),

    currentWeightKg: v.number(),
    goalWeightKg: v.optional(v.number()),

    goalRateKgPerWeek: v.optional(v.number()),

    currentBmi: v.optional(v.number()),

    currentBmrKcalPerDay: v.optional(v.number()),
    currentTdeeKcalPerDay: v.optional(v.number()),

    dailyCalorieAdjustmentKcal: v.optional(v.number()),

    activityMultiplier: v.optional(v.number()),

    nutritionTargets: v.object({
      caloriesKcal: v.number(),
      proteinGrams: v.number(),
      carbsGrams: v.number(),
      fatGrams: v.number(),
      fiberGrams: v.optional(v.number()),
      sodiumMg: v.optional(v.number()),
      sugarGrams: v.optional(v.number()),
    }),

    gender: v.union(
      v.literal("male"),
      v.literal("female"),
      v.literal("unspecified"),
    ),

    preferredUnits: v.union(v.literal("imperial"), v.literal("metric")),

    activityLevel: v.union(
      v.literal("sedentary"),
      v.literal("light"),
      v.literal("moderate"),
      v.literal("athlete"),
    ),

    goalType: v.union(
      v.literal("maintain"),
      v.literal("lose"),
      v.literal("gain"),
    ),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();

    const userId = await ctx.db.insert("users", {
      convexUserId: identity.subject,

      age: args.age,

      heightCm: args.heightCm,

      currentWeightKg: args.currentWeightKg,
      goalWeightKg: args.goalWeightKg,

      goalRateKgPerWeek: args.goalRateKgPerWeek,

      currentBmi: args.currentBmi,

      currentBmrKcalPerDay: args.currentBmrKcalPerDay,
      currentTdeeKcalPerDay: args.currentTdeeKcalPerDay,

      dailyCalorieAdjustmentKcal: args.dailyCalorieAdjustmentKcal,

      activityMultiplier: args.activityMultiplier,

      nutritionTargets: args.nutritionTargets,

      gender: args.gender,

      preferredUnits: args.preferredUnits,

      activityLevel: args.activityLevel,

      goalType: args.goalType,

      createdAt: now,
      updatedAt: now,
    });

    return userId;
  },
});
