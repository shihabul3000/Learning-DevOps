
import http,{IncomingMessage, Server , ServerResponse}from "http";
import { url } from "inspector";
import path, { parse } from "path";
import config from "./config";
import { appendFile } from "fs";
import addRoute, { RoteHandler, routes } from "./helpers/route-handler";

import "./Routes"
const server : Server = http.createServer((req : IncomingMessage , res : ServerResponse) =>{

    const method = req.method?.toUpperCase() || "";
    const path = req.url || "";

    const methodMap = routes.get(method)
    const handler : RoteHandler | undefined = methodMap?.get(path)

    if(handler){
       handler(req, res);
    }
    else{
        res.writeHead(404 , {"content-type" : "application/json"})
        res.end(JSON.stringify({
            success : false,
            message : "Route not found !!!",
            path : req.url,
            
        }));
    }

})

server.listen(config.port,()=> {
    console.log(`Server is running on PORT${config.port}`)
})

