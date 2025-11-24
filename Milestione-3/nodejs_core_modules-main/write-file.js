// this is syncronous 

const fs = require("fs");

const content1 = "This is a contnet \n Node Js is awsome";

try{
  fs.writeFileSync("./output/text-sync.txt" , content1);
  console.log("file written sync");


}catch(err){
  console.log("This is an Error ", err);
}


// This is asyncronous
const content2 = "Who am I? \n this is dummy content asyncronous";

fs.writeFile("./output/test-async.txt" , content2,(error)=> 
{
  if(error){
    console.log(error.message);
  }
  else{
    console.log("file written asynchronously");
  }
})

