// Type Assertion or type narrowing

let anything : any;

anything = 'Alvi';
//(anything as string)

/// Kg to gm converter

const kgTogmConverter = (input : string | number ) : string | number | undefined=> {
if(typeof input === 'number'){
    return input * 1000;
}
else if(typeof input === 'string') 
{
    const[value] = input.split(" ");
return `Converted output is : ${Number(value)*1000}`
}
}

const result1 = kgTogmConverter(2) as number
console.log({result1});
const result2 = kgTogmConverter('2 kg') as string
console.log({result2});



type CustomError = {
message : string;
}
try {

}
catch(err){
    console.log((err as CustomError).message)
}