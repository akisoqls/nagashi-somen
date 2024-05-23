import { Hono, type Context } from "https://deno.land/x/hono@v4.3.9/mod.ts";
import { cursorTo } from "https://deno.land/x/cliffy@v1.0.0-rc.4/ansi/mod.ts";
import { bamboo } from "./bamboo.ts";

const app = new Hono();

bamboo.forEach(b => {
  console.log(b.template)
})

app.get("/", (context: Context) => {
  context.res.headers.append('Content-Type', 'text/html');
  let somens = generateStreamingSomen({
    banbooLength: bamboo.length,
    banbooWidth: bamboo.reduce<number>((maximum, current) => {
      const [_, width] = current.somenArea
      return Math.max(width, maximum)
    }, 0),
  })
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      (async () => {
        try {

          while (true) {
            let string = cursorTo(0, 0);

            somens = generateStreamingSomen({ streamingSomen: somens })
            let index = 0;
            for (const somen of somens) {

              const aaLineTemplate = bamboo[index];
              const [somenStart, somenWidth] = aaLineTemplate.somenArea;
              const somenToUse = somen.slice(0, somenWidth);
              const { template } = aaLineTemplate;

              const convertBooleanToSomen = somenToUse.map((isExistsSomen, charAt) => {
                return isExistsSomen ? aaLineTemplate.replacement : template.at(somenStart + charAt)
              }).join("");

              convertBooleanToSomen

              const somenOnBambooAA = template.slice(0, somenStart)
                + convertBooleanToSomen
                + template.slice(somenStart + convertBooleanToSomen.length);
              
              string += somenOnBambooAA;
              string += "\n";

              index ++
            }

            controller.enqueue(encoder.encode(string));
            await sleep(100);
          }
        } catch {
          return
        }
      })();
    },
    cancel(reason) {
      console.log('Stream canceled:', reason);
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

const sleep = (milliSeconds = 0) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(undefined), milliSeconds);
  })
}

/**
 *  banboo
 *     
 * ||<---Width--->||  ↑
 * ||             ||  |
 * ||             ||  |
 * ||             ||  |
 * ||             || length
 * ||             ||  |
 * ||             ||  |
 * ||             ||  |
 * ||             ||  ↓
 * 
 * @param {number} banbooLength
 * @param {number} banbooWidth 
 * @returns {boolean[][]}
 */

const generateStreamingSomen = (
  {
    banbooLength,
    banbooWidth,
    streamingSomen
  }: {
    banbooLength: number
    banbooWidth: number
    streamingSomen?: undefined 
  } | {
    banbooLength?: undefined
    banbooWidth?: undefined
    streamingSomen: boolean[][]
  }
) => {

  const makeSomenLine = (s: boolean[]) => {
    return s.map(isExistsSomen => {
      return isExistsSomen
        ? Math.random() < 0.97
        : Math.random() < 0.07;
    });
  }
  
  let somen: boolean[][] = [];

  if (streamingSomen) {
    somen = streamingSomen;
    const prevFrame = somen[0]
    const additionalSomen = makeSomenLine(prevFrame)
    somen.unshift(additionalSomen)
    somen.pop();
  } else {
    somen[0] = Array.from({ length: banbooWidth }, () => Math.random() < 0.5);
    for (let i = 1; i < banbooLength; i++) {
      somen[i] = makeSomenLine(somen[i - 1]);
    }  
  }

  return somen;
}