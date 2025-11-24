const { error } = require("console");
const fs = require("fs");

fs.readFile("./data/diary.txt" , "utf-8" , (error,data) => {
console.log("Start Reading .....");

if(error){
  console.error("error Happend : " , error.message);
}
else{
  console.log("File Content");
  console.log(data);
}

});

console.log("This run immediately - no blocking")