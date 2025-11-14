// object destructuring
// array destructuring


const user = {
id : 123,
name : {
    firstName : 'Mezbaul',
    middleName : 'Abedin',
    lastName : 'Forhan',
},
gender: 'Male',
favoriteColor : 'Purple',
};

const {favoriteColor : myFavoriteColor , 
    name : {middleName : mymiddleName}} = user;  // name elies favoriteColor : myFavoriteColor

//console.log(myFavoriteColor , mymiddleName);


// array destructuring

const schoolFriends = [ 'pintu' , 'chintu' , 'bulbul'];

const [,,myBestFriend] = schoolFriends

console.log(myBestFriend);