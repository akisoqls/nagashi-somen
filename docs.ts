import { UserAgent } from "https://deno.land/std@0.224.0/http/user_agent.ts";
import { createHtmlDocuments } from "./mods/html.ts";

export const indexHtml = async (request: Request, bamboo: string) => {
  const userAgentString = request.headers.get("user-agent");
  const userAgent = new UserAgent(userAgentString);

  const replacements: { [key: string]: string } = {
    bamboo,
    requestUrl: request.url,
    userAgentOs: userAgent.os.name || "unknown",
    protocol: new URL(request.url)
      .protocol.replaceAll(/\:$/g, "")
      .toLocaleUpperCase(),
    origin: new URL(request.url).origin,
  };
  const html = await createHtmlDocuments("./index.html", replacements);

  return html;
};
