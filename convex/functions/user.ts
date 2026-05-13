import { query } from "../_generated/server";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    return {
      name: identity.name,
      email: identity.email,
      userid: identity.subject,
    };
  },
});