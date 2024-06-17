import { bamboo } from "./bamboo.ts";
import { indexHtml } from "./docs.ts";
import { generateSomenAA, generateStreamingSomen } from "./somen.ts";

const bambooString = bamboo.map((b) => b.template).join("\n");
console.log(bambooString);

const sleep = (milliSeconds = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), milliSeconds);
  });
};

const port = 3000;
Deno.serve({ port }, (request: Request) => {
  const url = new URL(request.url);

  if (url.pathname !== "/") {
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
      indexHtml(request, bambooString),
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
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start: (controller) => {
      (async () => {
        try {
          while (true) {
            somens = generateStreamingSomen({ streamingSomen: somens });
            const string = generateSomenAA(somens);
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
