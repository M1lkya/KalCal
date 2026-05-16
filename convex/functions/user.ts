import { query } from "../_generated/server";

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
