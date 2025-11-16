// static -- poriborton hoy nah

class Counter{
   static count : number = 0;

   static increment(){
        return (Counter.count = Counter.count + 1) ;
    }
   static decrement() {
        return (Counter.count = Counter.count -1);
    }
}

//const instance1 = new Counter()

//instance1.increment();

// console.log(instance1.increment())
// console.log(instance1.increment())

// console.log('``````````````````');

// const instance2 = new Counter()
// console.log(instance2.increment());
// console.log(instance2.increment());
// console.log(instance2.increment());


// console.log('``````````````````');

// const instance3 = new Counter()
// console.log(instance3.increment());


// const instance = new Counter()



console.log(Counter.increment());
console.log(Counter.increment());
console.log(Counter.increment());
console.log(Counter.increment());
console.log(Counter.increment());
console.log(Counter.decrement());
console.log(Counter.decrement());
console.log(Counter.decrement());
console.log(Counter.decrement());
console.log(Counter.decrement());
console.log(Counter.decrement());
console.log(Counter.decrement());