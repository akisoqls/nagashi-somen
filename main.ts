import { bamboo } from "./bamboo.ts";
import { indexHtml } from "./docs.ts";
import { generateSomenAA, generateStreamingSomen } from "./somen.ts";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

const bambooString = bamboo.map((b) => b.template).join("\n");
console.log(bambooString);

const sleep = (milliSeconds = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), milliSeconds);
  });
};

const port = 3000;
Deno.serve({ port }, async (request: Request) => {
  const url = new URL(request.url);

  if (url.pathname !== "/") {
    if (url.pathname == "/index.html") {
      const response = Response.redirect(
        url.href.replace("/index.html", ""),
        302,
      );
      return response;
    }
    if (url.pathname.startsWith("/assets")) {
      return serveDir(request, {
        fsRoot: "./public",
        quiet: true,
      });
    }
    const response = new Response(
      "Not Found",
      {
        headers: {
          "Content-Type": "text/plain",
        },
        status: 404,
      },
    );
    return response;
  }
  const userAgent = request.headers.get("user-agent") || "";

  if (!userAgent.includes("curl")) {
    const response = new Response(
      await indexHtml(request, bambooString),
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    );
    return response;
  }

  let somens = generateStreamingSomen({
    banbooLength: bamboo.length,
    banbooWidth: bamboo.reduce<number>((maximum, current) => {
      const [_, width] = current.somenArea;
      return Math.max(width, maximum);
    }, 0),
    somenLength: 30,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start: (controller) => {
      (async () => {
        try {
          while (true) {
            somens = generateStreamingSomen({
              streamingSomen: somens,
              somenLength: 30,
            });
            let string = generateSomenAA(somens);
            string += "<Control + C>: Stop Stream";
            controller.enqueue(encoder.encode(string));
            await sleep(100);
          }
        } catch {
          return;
        }
      })();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
});
