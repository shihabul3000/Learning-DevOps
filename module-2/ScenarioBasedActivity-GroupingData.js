//* Grouping and Aggregating Data

// Scenario: Count every survey and group by response

//? input
const surveyResponses = [
  "A",
  "C",
  "B",
  "A",
  "B",
  "B",
  "C",
  "A",
  "B",
  "D",
  "A",
  "C",
  "B",
  "A",
];

//1000 initiate empty object
// check if the response alreadyexist or not
// if it exists then increment the count
// if not the initialize it with 1


const count = surveyResponses.reduce((table , response) => {
   if( table[response]) {
    table[response] = table[response] + 1
   }
   else {
    table[response] = 1

   }

   return table
} , {})

// console.log(count);


// Aggregating Data

const sales = [
  { category: "Electronics", item: "Laptop", price: 1200, quantity: 1 },
  { category: "Books", item: "JS Basics", price: 30, quantity: 2 },
  { category: "Electronics", item: "Mouse", price: 25, quantity: 2 },
  { category: "Home", item: "Chair", price: 150, quantity: 1 },
  { category: "Books", item: "React Deep Dive", price: 50, quantity: 1 },
  { category: "Electronics", item: "Keyboard", price: 80, quantity: 1 },
];


const totalSalesByCategory = sales.reduce((table , sale) => {

    const {category , price , quantity} = sale

if(!table[category]){
        table[category ]= {
        totalRevenue : 0,
        itemCount : 0,
    };
}

    table[category].totalRevenue += price * quantity;
    table[category].itemCount += quantity;


    return table
} ,{} )

console.log(totalSalesByCategory);