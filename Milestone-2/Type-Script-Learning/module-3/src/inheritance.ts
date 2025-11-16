
class Parent {

 name : string;
    age : number;
    address : string ;

    constructor(
        name : string ,
        age : number,
        address : string,
    ){
        this.name = name;
        this.age = age;
        this .address = address;
    }

    getSleep(numofhours : number){
        console.log(`${this.name} ${numofhours} ghonta ghumai `);
    }

}



class Student extends Parent {
    rollNumber : number;

    constructor(name:string , age : number , address:string , rollNumber : number){
        super(name , age , address );
        this.rollNumber = rollNumber
    };
}


const student1 = new Student(
    'Mr.Fakibaaz' , 
    18,
    'Bangladeshi',
    3000,
    )

    student1.getSleep(10);



    class Teacher extends Parent {
    
    designation : string;

    constructor(name:string, age:number , address: string , designation : string){

        super(name , age , address)

        this.designation = designation;
    }

    takeClass(numberofClass : number){
        console.log(`${this.name} ${numberofClass} ghonta class nay teacher`);
    }


}

const teacher1 = new Teacher('Mr.Smart teacher' , 25 , 'Nohakhali' , 'Senior Teacher')

teacher1.takeClass(5);

