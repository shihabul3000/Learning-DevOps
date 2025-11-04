
//  Generate a Lookup Table 

const postsArray = [
  { id: "p-101", title: "Intro to SQL", author: "Alex" },
  { id: "p-102", title: "Data Structures in JS", author: "Beth" },
  { id: "p-103", title: "Understanding Reduce", author: "Chris" },
  { id: "p-104", title: "CSS Grid Tricks", author: "Alex" },
];

const lookupTable = postsArray.reduce((table , post) => {
table[post.id] = post

return table;
},{})

//console.log(lookupTable);


// const post = postsArray.find((post) => post.id === "p-101")

const post = lookupTable[`p-103`];

for(let post in lookupTable) {
    console.log(lookupTable[post]);
}
// console.log(post);