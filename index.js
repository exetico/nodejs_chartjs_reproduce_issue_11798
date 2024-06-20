import http from "http";
import {generateRoute} from "./route-generate.js";

http
  .createServer(function (req, res) {
    if (req.url.startsWith("/generate")) {
        try{
            return generateRoute(req, res);
        }catch(e){
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write("Error:\n" + e.message);
            res.end();
        }
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(`Hello, you.<br>
            Get <a href="/generate?type=ok">ok</a> or <a href="/generate?type=invalid">invalid</a> chart.<br>
            You can also add <code>opts</code> parameter to the URL. Supported options:<br>
            <ul>
                <li><code>no-annotations</code> - no annotations</li>
                <li><code>no-defaults</code> - no defaults set on Chart.defaults</li>
            </ul>
            The issue with no anon and no defaults can be generated here: <a href="/generate?type=invalid&opts=no-annotations,no-defaults">invalid</a>
            `);
        res.end();
      }
  })
  .listen(3000);
