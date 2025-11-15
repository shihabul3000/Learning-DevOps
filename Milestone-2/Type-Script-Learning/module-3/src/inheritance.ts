class Student {
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


const student1 = new Student(
    'Mr.Fakibaaz' , 
    18,
    'Bangladeshi'
    )
    student1.getSleep(10);