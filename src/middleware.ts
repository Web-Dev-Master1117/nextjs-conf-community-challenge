import type { AstroGlobal } from "astro";
import { createClient } from "@vercel/edge-config";

interface ChallengesEnabled {
  challengeOne: boolean;
  challengeTwo: boolean;
  challengeThree: boolean;
}

export async function onRequest(
  context: AstroGlobal,
  next: () => Promise<Response>
): Promise<Response> {
  const edgeConfig = createClient(import.meta.env.EDGE_CONFIG);
  const challengesEnabled = (await edgeConfig.get(
    "challengesEnabled"
  )) as ChallengesEnabled;

  if (
    context.url.pathname.endsWith("challenge-1") &&
    !challengesEnabled.challengeOne
  ) {
    return context.redirect("/1-nextjs-conf/1-community-challenges/1-welcome");
  }

  if (
    context.url.pathname.endsWith("challenge-2") &&
    !challengesEnabled.challengeTwo
  ) {
    return context.redirect(
      "/1-nextjs-conf/1-community-challenges/2-challenge-1"
    );
  }

  if (
    context.url.pathname.endsWith("challenge-3") &&
    !challengesEnabled.challengeThree
  ) {
    return context.redirect(
      "/1-nextjs-conf/1-community-challenges/3-challenge-2"
    );
  }

  return next();
}
