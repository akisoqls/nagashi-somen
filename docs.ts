import { html } from "https://deno.land/x/hono@v4.3.9/helper/html/index.ts";
import { Context } from "https://deno.land/x/hono@v4.3.9/mod.ts";

export const index = (context: Context, bamboo: string) => {
  return html`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>"Nagashi Somen" - The world's first Somen Streaming Service</title>
  <style>
    *{
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
    }

    body{
      padding: 60px 0;
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
      border-radius: 4px;
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

    <pre>${bamboo}</pre>
    <div>
      <h1>Somen Streaming Service<br />"Nagashi Somen"</h1>
      <p>Use this <code>curl</code> command in your terminal to access somen stream:</p>
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
</html>`
}