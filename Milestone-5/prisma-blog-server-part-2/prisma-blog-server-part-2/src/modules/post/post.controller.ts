import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(400).json({
                error: "Unauthorized!",
            })
        }
        const result = await postService.createPost(req.body, user.id as string)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Post creation failed",
            details: e
        })
    }
}

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json(posts);
    } catch (e) {
        res.status(500).json({
            error: "Failed to fetch posts",
            details: e
        })
    }
}

const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Post ID is required"
            });
        }

        const post = await postService.getPostById(id);

        if (!post) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        res.status(200).json(post);
    } catch (e) {
        res.status(500).json({
            error: "Failed to fetch post",
            details: e
        })
    }
}

export const PostController = {
    createPost,
    getAllPosts,
    getPostById
}