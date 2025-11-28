
// ei jinish bujhi nai

import { IncomingMessage, ServerResponse } from "node:http";

export type RoteHandler = (req : IncomingMessage , res : ServerResponse) => void;
export const routes : Map<string,Map<string, RoteHandler>> = new Map()

function addRoute(method : string , path : string, handler : RoteHandler ) {
    if(!routes.has(method)) routes.set(method,new Map());
    routes.get(method)!.set(path,handler);
}

export default addRoute;