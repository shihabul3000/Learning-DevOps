import { prisma } from "./lib/prisma";



async function run() {
    
    // const createUser = await prisma.user.create({
    //     data : {
    //         name : "Yoyo Alvi",
    //         email : "yoyoalvi@gamil.com",
    //     }
    // })

    // console.log("Created user :" , createUser);


    // const createPost = await prisma.post.create({
    // data:{
    //     title: "This is title :",
    //     content : "this is a big content",
    //     authorId : 1
    // }
// })

// const createProfile = await prisma.profile.create({
//     data : {
//         bio : "Web Developer",
//         userId : 1
//     }
// })

// retrive all user

// const users = await prisma.user.findMany({
//     include:{
//         post : true,
//         profile : true
//     }
// });

// const updateUser = await prisma.profile.update({
//     where:{
//         userId:1
//     },
//     data : {
//       bio : "Web Developer",
//       dateofBirth : "2025-12-25T11:17:15.130Z"
//     },
//     select : {
//         id : true,
//         bio: true,
//         user : {
//             select : {
//                 id : true
//             }
//         }
//     }
// })

// const deleteUser = await prisma.user.delete({
//     where : {
//         id: 3
//     }
// })

// const getUserDataById = await prisma.user.findUnique({
//     where : {
//         id : 3
//     },
//     include:{
//         post : true,
//         profile : true
//     }
// })



const upsertUser = await prisma.user.upsert({
    where:{
        email : "jjk@gamil.com"
    },
    update : {
        name : "Alvi2"
    },
    create : {
        name : "Alvi3",
        email : "omago@gamil.com"
    }
})


console.log(upsertUser)

}

run()

