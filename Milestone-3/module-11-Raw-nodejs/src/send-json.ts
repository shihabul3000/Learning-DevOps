import { ServerResponse } from "http";
import path from "path";


function sendJson( res : ServerResponse , statusCode : number , data : any  ){

    res.writeHead(statusCode , {"content-type" : "application/json"})

    res.end(JSON.stringify(data))


}

export default sendJson;