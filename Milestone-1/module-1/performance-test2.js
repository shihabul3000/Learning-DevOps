const startTime = performance.now()


function addUp(n){
    return n*(n+1) /2;
}
const n = 1000000;
console.log(addUp(n));


const endTime = performance.now()

console.log(`This Code Took ${endTime-startTime} ms`);