require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const Task = require('./models/Task');

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://taskdo-gold.vercel.app" // Your live domain
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ DB CONNECT
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("DB connected ✅");
    } catch (err) {
        console.log("DB ERROR ❌:", err);
    }
};

connectDB();

// ✅ COOKIE MIDDLEWARE
app.use((req, res, next) => {
    let userId = req.cookies.userId;

    if (!userId) {
        userId = crypto.randomUUID();

        res.cookie('userId', userId, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
    }

    req.userId = userId;
    next();
});

// ───────── ROUTES ─────────

// GET ALL
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// CREATE
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description, createdAt } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Title is required" });
        }

        const task = new Task({
            title: title.trim(),
            description,
            createdAt: createdAt || new Date(),
            userId: req.userId
        });

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create task" });
    }
});

// UPDATE
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { ...req.body },
            { new: true }
        );
        res.json(task);
    } catch {
        res.status(500).json({ error: "Update failed" });
    }
});

// TOGGLE
app.patch('/api/tasks/:id/toggle', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
        task.completed = !task.completed;
        await task.save();
        res.json(task);
    } catch {
        res.status(500).json({ error: "Toggle failed" });
    }
});

// DELETE
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: "Delete failed" });
    }
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(5000, () => console.log("Server running on 5000"));
}