type User = {
    id: number,
    name:{
        firstName : string;
        middleName ? : string;
        lastName : string;
    },
    gender : 'male' | 'female',
    constactNo : '01866546',
    
    adress : {
        divition : String,
        city : string,
    }

} 






const user1 : User= {
    id : 123,
    name:{
        firstName : "Alvi",
        lastName : "shihabul",

    },
gender : 'male',
constactNo : '01866546',

adress : {
 divition : "Dhaka",
 city : "Gazipur",
}
}



const user2 : User = {
    id : 123,
    name:{
        firstName : "Daisy",
        lastName : "Khala",

    },
gender : 'female',
constactNo : '01866546',

adress : {
 divition : "Chottogram",
 city : "Barishal",
}
}


// for string

type name = string
const myName : name = 'me.y';


// function

type AddFunc = (num1 : number , num2 :number) => number;
const add : AddFunc = (num1 , num2) => num1 + num2 