// array , object

// ts- tuple 


let bazarList : string[]= ['eggs' , 'milk', 'sugar' , ];

// tuple
let mixArr : (string | number) [] = ['eggs' , 12 , 'milk' , 1, "su"]

mixArr.push('apple' , 50);

console.log("mixed array is the : ",mixArr);



// Tuple
//let coordinates : [number,number] = [20 , 30 , 50];  // fixed length array

let couple : [string,string] = ['Husband' , 'Wife'];

let destination : [string,string,number] = ['Dhaka' , 'Chattogram' , 3];



// non-premetive is Referance type  : object
// how to define object explicitly in typeScript
// const user : {
//     organization : 'I Have No Idea'; // value type hishebe use hocche etakei bole *** literale Type****
//     firstName : string;
//     middleName?: string; // optional type
//     lastName : string;
//     isMarried : boolean;
// } = {
//     organization : 'I Have No Idea',
//     firstName : 'Shihabul Islam',
//     lastName : 'Alvi',
//     isMarried: false,
// }


const user : {
    readonly organization : string; // access modifier
    firstName : string;
    middleName?: string; // optional type
    lastName : string;
    isMarried : boolean;
} = {
    organization : 'I Have No Idea',
    firstName : 'Shihabul Islam',
    lastName : 'Alvi',
    isMarried: false,
}

//user.organization = 'I Have No Idea';