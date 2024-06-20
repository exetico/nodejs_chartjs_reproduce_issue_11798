import http from "http";
import {generateRoute} from "./route-generate.js";

http
  .createServer(function (req, res) {
    if (req.url === "/generate") {
        try{
            return generateRoute(req, res);
        }catch(e){
            res.write("Error:\n"+e.message);
            res.end();
        }
      } else {
        res.write("Hello you!");
        res.end();
      }
  })
  .listen(3000);
