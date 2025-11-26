// password123;
//  jfjfkffkjff1564fdfh89ysfD#jaj

const crypto = require("crypto");

console.log("\n MD5 Hash");
const mdHash = crypto.createHash("md5").update("Password123").digest("hex");
console.log("Input passwod is : password 123");
console.log("MD5 HashPassword-->",mdHash);

console.log("*".repeat(50));

const sha256Hash = crypto.createHash('sha256').update('password123').digest("hex");
console.log("Input Password123");
console.log("SHA256 : HashedPassword-->" , sha256Hash);

console.log("*".repeat(50));

const sha512Hash = crypto.createHash('sha512').update('password123').digest("hex");
console.log("Input Password123");
console.log("SHA512 : HashedPassword-->" , sha512Hash);