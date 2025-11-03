//? Input
const rawApiData = [
  {
    id: "p-001",
    productName: "Quantum Laptop",
    category: "Electronics",
    price: 1200,
    rating: 4.8,
    stock: 15,
  },
  {
    id: "p-002",
    productName: "The Art of Code",
    category: "Books",
    price: 45,
    rating: 4.5,
    stock: 100,
  },
  {
    id: "p-003",
    productName: "Cyber Hoodie",
    category: "Clothing",
    price: 80,
    rating: 4.7,
    stock: 50,
  },
  {
    id: "p-004",
    productName: "4K Drone",
    category: "Electronics",
    price: 650,
    rating: 4.3,
    stock: 20,
  },
  {
    id: "p-005",
    productName: "Basic JavaScript",
    category: "Books",
    price: 25,
    rating: 3.8,
    stock: 200,
  },
  {
    id: "p-006",
    productName: "Smart Watch",
    category: "Electronics",
    price: 250,
    rating: 4.7,
    stock: 70,
  },
  {
    id: "p-007",
    productName: "Classic T-Shirt",
    category: "Clothing",
    price: 30,
    rating: 4.2,
    stock: 300,
  },
  {
    id: "p-008",
    productName: "Design Patterns",
    category: "Books",
    price: 55,
    rating: 4.9,
    stock: 80,
  },
  {
    id: "p-009",
    productName: "VR Headset",
    category: "Electronics",
    price: 400,
    rating: 4.6,
    stock: 30,
  },
  {
    id: "p-010",
    productName: "USB-C Cable",
    category: "Electronics",
    price: 15,
    rating: 4.0,
    stock: 500,
  },
  {
    id: "p-011",
    productName: "Noise-Cancelling Headphones",
    category: "Electronics",
    price: 300,
    rating: 4.7,
    stock: 40,
  },
  {
    id: "p-012",
    productName: "Algorithms Explained",
    category: "Books",
    price: 50,
    rating: 4.5,
    stock: 60,
  },
];

// Output => [{name : "phone"} , {name : "smart watch"}]

/**
 * process
 * filter => Electronics
 * Short by => first 3 (top 3)
 * Map => transform objet shape to {name : "Name"}
 */

const topElectronics = rawApiData.filter(
    (item) => item.category === "Electronics"
)
.sort((a,b) => b.rating - a.rating )
.slice(0, 3 )
.map((item) => {
   return{name : item.productName}
})

console.log(topElectronics);












