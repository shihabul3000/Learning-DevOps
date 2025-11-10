
const numbers = [1,2,3,4,5,6,7];

const hasEvenNumber = numbers.some((number) => number % 2 ==0 );
// const evenNumber = numbers.filter((number) => number % 2 == 0)
// const oddNumber = numbers.filter((number) => number % 2 !== 0)
// console.log("Even Number Is : ", evenNumber)
// console.log("ODD Number Is : ", oddNumber)
//console.log(hasEvenNumber);

const currentUserRoles = ["user", "editor", ""];

const featureAccessRoles = ["admin", "manager"];


const canAccess = currentUserRoles.some((role) => featureAccessRoles.includes(role));

//console.log(canAccess);


// const arr= Array.from({length : 5}).fill(0);
//const arr= Array.from({length : 5} , (_,i) => i);

// const arr = Array.from([1,2,3,4,5,6] , (value , i ) =>value* value )

//console.log(arr)


// const range = (start , stop , step) => Array.from({length : Math.ceil ((stop - start) /step) } ,(_,i) => start + i * step);

// console.log(range(0 , 1100 ,2));


const range = (start , stop , step) => Array.from({length : ((stop - start )/step)} ,(_,i) => start + i *step)

console.log(range(6 , 21 , 2));