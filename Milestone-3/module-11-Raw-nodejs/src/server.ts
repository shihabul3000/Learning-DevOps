
import http,{IncomingMessage, Server , ServerResponse}from "http";
import { url } from "inspector";
import path from "path";
import config from "./config";
import { appendFile } from "fs";

const server : Server = http.createServer((req : IncomingMessage , res : ServerResponse) =>{

    // Root Route
if(req.url == '/' && req.method == "GET"){
    res.writeHead(200 , {"content-type" : "application/json"});
    res.end(JSON.stringify({message : "Hellow world this is my first nodejs server using Type-Script",
        path : req.url, 
    }))
    
}


//Health Route

if(req.url == '/api' && req.method == "GET"){

     res.writeHead(200 , {"content-type" : "application/json"});
    res.end(JSON.stringify({message : "Health Status ok",
        path : req.url, 
    }))
}


if(req.url == "/api/users" && req.method == "POST"){
//     const user = {
//         id: 1,
//         name : "alice" ,
//     };


//   res.writeHead(200 , {"content-type" : "application/json"});
//     res.end(JSON.stringify(user))



let body = '';

// listen for data chunk 
req.on("data" , chunk => {
    body += chunk.toString();
})
req.on("end",()=>{
    const parseBody = JSON.parse(body);
    console.log();
});


res.end(JSON.stringify(
    {
        message : "processing-----"
    }
))



}




})

server.listen(config.port,()=> {
    console.log(`Server is running on PORT${config.port}`)
})
