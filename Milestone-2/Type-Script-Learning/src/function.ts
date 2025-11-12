// function
// Arrow function , normal function

function add1(num1:number , num2:number): number{
    return num1 + num2;
}

const total = add1(4,5);

//console.log(total);

const addArrow = (num1:number , num2 : number) : number => 
    num1 + num2;


const result = addArrow(2,9);

console.log(result);


//object => function => method  what is it??

const poorUser = {
    name : 'Alvi',
    balance : 10,
    addBalance(value : number){
      const totalBalance = this.balance + value;
      return totalBalance;
    },
};

const isTotal = poorUser.addBalance(1000);

console.log(isTotal);



// callback function ---> Loop er vitor function  what is call back function?


const array : number[] = [1,2,3,45,6,7,8,9,10];
const sqrArray = array.map((element : number): number => element*element);

console.log(sqrArray);