import { Hono, type Context } from "https://deno.land/x/hono@v4.3.9/mod.ts";
import { html } from "https://deno.land/x/hono@v4.3.9/helper/html/index.ts";
import { cursorTo } from "https://deno.land/x/cliffy@v1.0.0-rc.4/ansi/mod.ts";
import { bamboo } from "./bamboo.ts";

const app = new Hono();

const init = () => {
  
  const somens = generateStreamingSomen({
    banbooLength: bamboo.length,
    banbooWidth: bamboo.reduce<number>((maximum, current) => {
      const [_, width] = current.somenArea
      return Math.max(width, maximum)
    }, 0),
  })

  console.log(generateSomenAA(somens, false));

}

const generateSomenAA = (somens: boolean[][], withControlCharacters = true) => {
  let string = withControlCharacters ? cursorTo(0, 0) : "";
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

    const somenOnBambooAA = template.slice(0, somenStart)
      + convertBooleanToSomen
      + template.slice(somenStart + convertBooleanToSomen.length);
    
    string += somenOnBambooAA;
    string += "\n";

    index++;
  }
  return string;
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

    const bambooString = bamboo.map(b => b.template).join("\n");

    return context.html(html`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Somen Streaming Service</title>
        <style>
          *{
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
          }

          body{
            padding: 60px 20px 0 20px;
          }

          main{
            margin: 0 auto;
            width: 700px;
          }

          h1{
            text-align: center;
            margin: 32px 0;
          }
 
          p{
            line-height: 32px;
            font-size: 20px;
            text-align: center;
          }

          code{
            font-family: Menlo, Monaco, 'Courier New', monospace;
            background: #f0f0f0;
            padding: 2px 6px;
            font-size: 16px;
            border: 1px solid #3f4467;
            border-radius: 4px;
          }

          pre{
            font-family: Menlo, Monaco, 'Courier New', monospace;
            background: darkgreen;
            color: antiquewhite;
            width: auto;
            display: block;
            width: 391px;
            padding: 0;
            border-radius: 4px;
            box-shadow: 0 0 20px DarkSlateGray;
            padding: 8px;
            margin: 0 auto;
            text-align: center;
          }

          div.copy_text{
            margin: 16px 0 0 0;
            width: 100%;
          }
          
          div.copy_text > span{
            border: 1px solid #000;
            padding: 0px 16px;
            background: #fdfdfd;
            width: 100%;
            display: flex;
            justify-content: space-between;
          }

          input{
            display: block;
            all: unset;
            font-family: Menlo, Monaco, 'Courier New', monospace;
            width: 100%;
          }

          input::selection{
            background-color: aquamarine;
          }
          
          button{
            display: block;
            all: unset;
            font-size: 18px;
            border-left: 1px solid #000;
            padding: 6px 0px 6px 16px;
            background: #fdfdfd;
          }
        </style>
      </head>
      <body>
        <main>

          <pre>${bambooString}</pre>
          <div>
            <h1>Somen Streaming Service<br />"Nagashi Somen"</h1>
            <p>Use this <code>curl</code> command to access somen stream:</p>
            <div class="copy_text">
              <span>
                <input type="text" readonly value="curl ${context.req.raw.url}">
                <button onclick="copy()">copy</button>
              </span>
            </div>
          </div>
        </main>

        <script>
          const copy = () => {
            const input = document.querySelector("input");
            input.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
          }
          document.querySelector("button").addEventListener("click", e => {
            e.target.innerText = "copied"
            setTimeout(()=>{
              e.target.innerText = "copy"
            }, 2000);
          })
        </script>
      </body>
      </html>
    `)
  }

  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
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

init();

const port = 3000;

Deno.serve({ port }, app.fetch);
