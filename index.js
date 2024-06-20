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
        res.write('Hello, you. Get <a href="/generate?type=ok">ok</a> or <a href="/generate?type=invalid">invalid</a> chart.');
        res.end();
      }
  })
  .listen(3000);
