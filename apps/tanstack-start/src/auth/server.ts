import { reactStartCookies } from "better-auth/react-start";

import { initAuth } from "@acme/auth";

import { env } from "~/env";
import { getBaseUrl } from "~/lib/url";

export const auth = initAuth({
  baseUrl: getBaseUrl(),
  productionUrl: `http://${env.VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3001"}`,
  secret: env.AUTH_SECRET,
  googleClientId: env.AUTH_GOOGLE_ID,
  googleClientSecret: env.AUTH_GOOGLE_SECRET,

  extraPlugins: [reactStartCookies()],
});
