import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result;
}

const getAllPosts = async () => {
    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return posts;
}

const getPostById = async (id: string) => {
    const post = await prisma.post.findUnique({
        where: {
            id
        }
    });
    return post;
}

export const postService = {
    createPost,
    getAllPosts,
    getPostById
}

