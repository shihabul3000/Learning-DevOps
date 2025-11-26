const fs = require("fs");
fs.writeFileSync('./output/temp.txt' , "this is a temp file");

console.log("Temp file created");

if(fs.existsSync("./output/temp.txt")){
  console.log("file Exists!!");

  fs.unlinkSync("./output/temp.txt");
  console.log("file deleted");
}

try{
  fs.unlinkSync("./output/temp.txt")
}catch(error){
  console.log("Error : ",error.message);
}

fs.writeFile("./output/tem2.txt","Another temp file", error =>{
  if(error)return console.err(err.message);
  console.log("Another temp file created");
  fs.unlink("./output/temp2.txt" , (err)=>{
    if(err){
      console.error("Error :",err.message);
    }
    else{
      console.log("Temp2 deleted");
    }
  })
} )













