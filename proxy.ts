import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import { type NextRequest, NextResponse } from "next/server";
import { docsContentRoute, docsRoute } from "@/lib/shared";

const OLD_DOMAIN = "collectui.vercel.app";
const NEW_DOMAIN = "collectui.youquxing.com";

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.mdx`,
  `${docsContentRoute}{/*path}/content.md`,
);

export default function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host === OLD_DOMAIN) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = NEW_DOMAIN;
    url.port = "";

    const noticeUrl = request.nextUrl.clone();
    noticeUrl.pathname = "/migrate";

    const response = NextResponse.rewrite(noticeUrl);
    response.headers.set("X-New-Location", url.toString());
    return response;
  }

  // Preserve query params when root redirects to /docs
  if (request.nextUrl.pathname === "/" && request.nextUrl.search) {
    return NextResponse.redirect(
      new URL(`/docs${request.nextUrl.search}`, request.url),
    );
  }

  const result = rewriteSuffix(request.nextUrl.pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  return NextResponse.next();
}
