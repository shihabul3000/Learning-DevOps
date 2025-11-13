// Union Type

type userRole = 'admin' | 'user' | 'guest'

const getDashboard = (role : userRole) => {
    if(role === 'admin') {
        return ' Admin Dashboard'
    }
    else if(role === 'user'){
        return 'User Dashboard'
    }
    else{
        return 'Guest dashboard'
    }
};

getDashboard('guest');


// intersection &

type Employee = {
    id : string;
    name : string;
    phoneNo : string;
};

type Manager = {
    designation : string;
    teamSize : number;

}

type EmployeeManager = Employee & Manager;

const ChowdhuryShaheb : EmployeeManager ={
    name : "Chowdhury Shareb",
    id : '123',
    phoneNo : '56464695',
    designation : 'Admin',
    teamSize : 20,
    
}