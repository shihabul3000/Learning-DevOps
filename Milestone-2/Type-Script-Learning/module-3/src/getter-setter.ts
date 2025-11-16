{

    // getter
    // setter



class Bankaccount {
   public readonly userId : number ;
   public userName :  string;
   protected userBalance : number;

  constructor(userId : number , userName : string , userBalance : number){

    this.userId = userId;
    this.userName = userName;
    this.userBalance = userBalance;

    
  }  

  // Set Balance

//   addBalance(balance : number){
//     this.userBalance = this.userBalance + balance;
//   }

// using SETTER

set addBalance(amount : number){
    this.userBalance = this.userBalance + amount
}

//   //get
//   getBalance(){
//     return this.userBalance;
//   }



// Getter

get getBalance(){
  return  this.userBalance;
}



}

class StudentBankAccount extends Bankaccount {

}



const AlviVai = new Bankaccount(111 , 'Shihabul-Islam-Alvi' , 20)



AlviVai.addBalance = 100;
console.log(AlviVai);
console.log(AlviVai.getBalance);






















}