import "dotenv/config";
import express, { Application, Request, Response, NextFunction } from "express";
import { postRouter } from "./modules/post/post.router";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();

app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

app.all("/api/auth/*splat", async (req, res, next) => {
    console.log('Auth route hit:', req.url);
    console.log('Request body:', req.body);
    try {
        const handler = toNodeHandler(auth);
        await handler(req, res);
    } catch (error) {
        console.error('Auth handler error:', error);
        res.status(500).json({ error: 'Auth handler failed', details: error.message });
    }
});

app.get("/api/test", async (req, res) => {
    try {
        // Test database connection
        const userCount = await prisma.user.count();
        res.json({ 
            message: "API is working", 
            timestamp: new Date().toISOString(),
            userCount: userCount
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Database connection failed", 
            details: error.message 
        });
    }
});

app.use("/posts", postRouter);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

export default app;