class Counter {
    constructor(count) {

        this.count = count;
        
    }
     add(amount){
        this.count = this.count + amount;
    }
    
    print(){
        console.log(this.count);
    }
}


const counter1 = new Counter (0);

counter1.add(3);
counter1.add(2);

counter1.print();


const counter2 = new Counter(10);

counter2.add(20);
counter2.add(50);

counter2.print();