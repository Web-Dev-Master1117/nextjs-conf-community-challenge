import type { AstroGlobal } from "astro";

export function onRequest(
  context: AstroGlobal,
  next: () => Promise<Response>
): Promise<Response> {
  if (context.url.pathname.endsWith("2-challenge")) {
    return context.rewrite(
      new URL(
        "/1-nextjs-conf/1-community-challenges/1-challenge",
        context.request.url
      )
    );
  }

  if (context.url.pathname.endsWith("3-challenge")) {
    return context.rewrite(
      new URL(
        "/1-nextjs-conf/1-community-challenges/2-challenge",
        context.request.url
      )
    );
  }

  return next();
}
