// oop - class -object

// class Animal {
//  name : string;
//  species : string;
//  sound : string;


//  constructor(name : string , species : string , sound : string)
//  {
//     this.name = name;
//     this.species = species;
//     this.sound = sound;
//  }
// // method : karon class and function er majha majhi ache tai eta Method:
//  makeSound(){
//     console.log(`${this.name} is making sound ${this.sound}`);
//  }

// }

// const dog = new Animal('dogesh Vai' , 'Dog' , 'Ghewghew ')

// dog.makeSound();



// const cat = new Animal('Cat Vai' ,  'Cat' , 'Meow meow');

// cat.makeSound()

// console.log(cat.makeSound());




// Parameter properties

class Animal {

    // name : string;
    // spiecs : string;
    // sound : string;



    constructor(
        public name : string ,
        public species : string , 
        public sound : string,
    ){
        // this.name = name;
        // this.spiecs = species;
        // this.sound = sound;
    }

makeSound(){
    console.log(`${this.name} this Make Sound ${this.sound}`);
}
}



const cat = new Animal('Billw' , 'Cat' , 'Meow')
cat.makeSound()
