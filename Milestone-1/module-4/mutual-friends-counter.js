//Problem Statement

//You are given two large arrays, listA and listB. Each array contains user objects.
//A user object is guaranteed to have a unique id property (a string) and may contain other data, such as a name.

//Your task is to write an efficient function that takes both lists as input
//and returns the total count of users that are present in both lists.

//TODO has to be solved in Time Complexity O(n)

//! Do not change anything in data setup part
//----------Data setup block---------------//
const USER_COUNT = 50000;
let usersA = [];
let usersB = [];

const createUser = (id) => ({ id: `user_${id}`, name: `User ${id}` });

for (let i = 0; i < USER_COUNT; i++) {
  usersA.push(createUser(i));
  usersB.push(createUser(i + 25000));
}


console.log(usersA);
 console.log(usersB);
// users 25000 to 49999 are common (25,000 common users)
//----------Data setup block---------------//



// -- Algorithms -- //

const commonFriendShow = (usersA,usersB) => {
    const startTime = performance.now();
    const commonFriendShow = []
    
    //O(n^2)
    usersA.forEach(usersA => {

        //O(n)
        usersB.forEach((usersB) => {
               
            if(usersA.id === usersB.id){
                commonFriendShow.push(usersB);
            }
        })
    });

    const endTime = performance.now();

    return {count : commonFriendShow.length , timeTookToFinish : endTime - startTime}
};

//console.log(commonFriendShow(usersA,usersB));
///////////////////////////////


const commonFriendShowFast = (usersA, usersB) => {
  const startTime = performance.now();
  const commonFriend = [];

  // O(n)
  const idListA = new Set(usersA.map(user => user.id));

  // O(n)
  usersB.forEach(userB => {
    // O(1) lookup
    if (idListA.has(userB.id)) {
      commonFriend.push(userB);
    }
  });

  const endTime = performance.now();

  return { count: commonFriend.length, timeTookToFinish: endTime - startTime };
};

console.log(commonFriendShowFast(usersA, usersB));
