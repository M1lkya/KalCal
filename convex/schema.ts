import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),

    age: v.string(),

    heightCm: v.number(),

    currentWeightKg: v.number(),
    goalWeightKg: v.optional(v.number()),

    // Example: 0.25 means 0.25 kg per week.
    // Only needed for lose/gain goals.
    goalRateKgPerWeek: v.optional(v.number()),

    // Calculated health numbers
    currentBmi: v.optional(v.number()),

    // BMR and TDEE are numbers, measured in calories per day.
    currentBmrKcalPerDay: v.optional(v.number()),
    currentTdeeKcalPerDay: v.optional(v.number()),

    dailyCalorieAdjustmentKcal: v.optional(v.number()),

    // Example: sedentary = 1.2, moderate = 1.55, etc.
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

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerkUserId", ["clerkUserId"]),

  dailyLog: defineTable({
    clerkUserId: v.string(),

    date: v.string(),

    nutritionTargets: v.object({
      caloriesKcal: v.number(),
      proteinGrams: v.number(),
      carbsGrams: v.number(),
      fatGrams: v.number(),
      fiberGrams: v.optional(v.number()),
      sodiumMg: v.optional(v.number()),
      sugarGrams: v.optional(v.number()),
    }),

    calories: v.number(),
    protienGrams: v.number(),
    fatGrams: v.number(),
    carbsGrams: v.number(),
    fiberGrams: v.optional(v.number()),
    sugarGrams: v.optional(v.number()),
    sodiumMg: v.optional(v.number()),

    steps: v.optional(v.number()),
    water: v.optional(v.number()),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_clerkUserId_date", ["clerkUserId", "date"]),
});
