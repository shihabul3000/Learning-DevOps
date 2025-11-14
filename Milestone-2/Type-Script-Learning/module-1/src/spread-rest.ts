// spread operator

const friends = ['Rahim' , 'Karim'];

const schoolFriends = [ 'pintu' , 'chintu' , 'bulbul'];

const collegeFriends = ["Mr,Smart" , "Mr. Very Very Smart"];

friends.push(...schoolFriends);
friends.push(...collegeFriends);

console.log(friends);


const user = {name : 'Alvi' , phoneNo : "01654654"};

const otherInfo = {
    hobby : 'outing' , favoriteColor : 'purple' , 
}

const userInfo = {...user,...otherInfo};

console.log(userInfo);


// Rest Operator

// const sendInvite = (...friends : string[]) => {
//     friends.forEach((friend : string) => 
//         console.log(`Send invitation to ${friend}`))
// };

// sendInvite('pintu','chintu' , 'bulbul' , 'alvi');

const sendBus = (...buses : string[]) => {
buses.forEach((bus : string) => {
    console.log(`Send Buses to this loction : ${bus}`);
})
}

sendBus('Dhaka' , 'Chottogram' , 'Palton' , 'Gazipur');