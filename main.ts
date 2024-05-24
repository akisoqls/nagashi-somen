import { Hono, type Context } from "https://deno.land/x/hono@v4.3.9/mod.ts";
import { bamboo } from "./bamboo.ts";
import { indexHtml } from "./docs.ts";
import { generateStreamingSomen, generateSomenAA } from "./somen.ts";

const app = new Hono();

const bambooString = bamboo.map(b => b.template).join("\n");
console.log(bambooString);

const sleep = (milliSeconds = 0) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(undefined), milliSeconds);
  })
}

app.get("/", (context: Context) => {
  context.res.headers.append('Content-Type', 'text/html');

  let somens = generateStreamingSomen({
    banbooLength: bamboo.length,
    banbooWidth: bamboo.reduce<number>((maximum, current) => {
      const [_, width] = current.somenArea
      return Math.max(width, maximum)
    }, 0),
  })
  
  const userAgent = context.req.header('User-Agent') || '';
  
  if (!userAgent.includes('curl')) {
    return context.html(indexHtml(context, bambooString));
  }
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start: (controller) => {
      (async () => {

        try {

          while (true) {

            somens = generateStreamingSomen({ streamingSomen: somens })
            const string = generateSomenAA(somens)
            controller.enqueue(encoder.encode(string));
            await sleep(100);

          }

        } catch {
          return
        }
      })();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    }
  });
});

const port = 3000;
Deno.serve({ port }, app.fetch);
