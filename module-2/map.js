
const course1 = {name : "Machine Learning"};
const course2 = {name : "Data Structure and Algorithm"};

const map = new Map();
map.set(course1 , "Machine Learning");
map.set(course2 , "Data Structure and Algorithm");



// console.log(map.has(course2));

// map.forEach((value , key) => key.name = "Shohoz Shorol Simple ----" + key.name );
// console.log(map.key);

for (let key of map.keys()) {
    key.name = "Shohoz Shorol Simple ---" + key.name;
}

// console.log(map);
console.log(map.entries());