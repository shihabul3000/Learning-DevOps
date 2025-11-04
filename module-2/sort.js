const numbers = [40, 100, 1, 5, 25, 10];
const fruits = ["Banana", "Dates" ,"apple", "Cherry", "date"];

// const sortedNumber = numbers.sort((a,b) => a-b)  // implace sorting --> what is implace sorting

// console.log(numbers);
// console.log(sortedNumber);


fruits.sort( (a,b) => a.localeCompare(b) );

//console.log(fruits);


// Nested array flat
const arr = [1, 2, 3, [4, 5, [6, 7, [8, 9, [10, 11]]]]];

const flatArr = arr.flat(Infinity);

console.log(flatArr);





const tagsFromPosts = [
  ["javascript", "react", "css"],
  ["node", "express"],
  ["css", "html", "react"],
];

const filterTags =[... new Set(tagsFromPosts.flat())];

console.log(filterTags);
