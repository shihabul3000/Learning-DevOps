// array , object

// ts- tuple 


let bazarList : string[]= ['eggs' , 'milk', 'sugar' , ];

// tuple
let mixArr : (string | number) [] = ['eggs' , 12 , 'milk' , 1, "su"]

mixArr.push('apple' , 50);

console.log("mixed array is the : ",mixArr);



// Tuple
let coordinates : [number,number] = [20 , 30 , 50];  // fixed length array

let couple : [string,string] = ['Husband' , 'Wife'];

let destination : [string,string,number] = ['Dhaka' , 'Chattogram' , 3];



// Referance type  : object

const user = {
    firstName : 'Shihabul Islam',
    middleName : null;
    lastName : 'Alvi'
}