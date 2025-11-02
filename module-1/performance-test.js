
const startTime = performance.now()


function addUp(n){
    let sum = 0;
    for(let i = 0 ; i <=n ; i++){
        sum += i;
    }
    return sum;

}

const n = 1000000
console.log(addUp(n))


const endTime = performance.now();

console.log (`This code took ${endTime-startTime} ms`) ;