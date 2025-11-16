{

    // oop : instance of type guard / type narrowing

class Person {
    name : string;

    constructor(name :string){
        this.name = name;
    }
       getSleep (numofhours : number){
        console.log(`${this.name} doinik ${numofhours} ghonta Ghumay`);
    }
}

class Student extends Person {
    constructor(name:string){
        super(name);
    }
    doStudy(numofhours : number){
        console.log(`${this.name} doinik ${numofhours} ghonta study kore`);
    }
}

class Teacher extends Person {
    constructor(name : string){
        super(name)
       

    }
       takeClass(numofhours : number){
        console.log(`${this.name} doinik ${numofhours} ghonta Class Nay`);
    }
}

//function guard

const isStudent = (user : Person) => {
    return user instanceof Student; // true or false
}
const isTeacher = (user : Person) => {
    return user instanceof Teacher; // true or false
}



const getUserInfo = (user : Person)=> {
if(isStudent(user)){
    user.doStudy(60);

}

else if(isTeacher(user)){
    user.takeClass(40);
}
else {
    user.getSleep(8)
}
}

//instance

const student1 = new Student('Mr.Student')
const teacher1 = new Teacher('Mr.Teacher')

getUserInfo(student1)
getUserInfo(teacher1)

















}