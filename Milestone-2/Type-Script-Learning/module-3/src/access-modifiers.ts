// access > modify

class Bankaccount {
   public readonly userId : number ;
   public userName :  string;
   protected userBalance : number;

  constructor(userId : number , userName : string , userBalance : number){

    this.userId = userId;
    this.userName = userName;
    this.userBalance = userBalance;

    
  }  

  addBalance(balance : number){
    this.userBalance = this.userBalance + balance;
  }


}

class StudentBankAccount extends Bankaccount {

}



const AlviVai = new Bankaccount(111 , 'Shihabul-Islam-Alvi' , 20)

AlviVai.addBalance(100);
AlviVai.addBalance(50);

console.log(AlviVai);