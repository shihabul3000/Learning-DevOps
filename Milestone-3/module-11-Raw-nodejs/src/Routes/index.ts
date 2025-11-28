
import addRoute from "../helpers/route-handler"
import parseBody from "../Pars/parse-body"
import sendJson from "../send-json"

addRoute('GET' , '/' , (req , res)=>{

  sendJson(res , 200 , {
    message : "Hellw im trying to new methods heheh :):",
    path : req.url,
        
  } )
})

addRoute("GET", "/api" , (req , res)=>{

    sendJson(res , 200,{
        message : "this is an /API route enjoy",
        path : req.url,
        
    })

})

addRoute("POST" , "/api/users" , async(req,res) =>{
 const body = await parseBody(req);
 sendJson(res, 201 , {success : true, data: body} );
});