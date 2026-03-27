require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');
const Task = require('./models/Task');


const app = express();



const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        console.log("Already connected");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected ✅");
    } catch (err) {
        console.log("DB ERROR ❌:", err);
    }
};

connectDB();

// || 

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ─────────────────────────────────────────────
// COOKIE (USER IDENTIFICATION)
// ─────────────────────────────────────────────
app.use((req, res, next) => {
    if (!req.cookies.userId) {
        res.cookie('userId', crypto.randomUUID(), {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });
    }
    next();
});

// ─────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────

// GET all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.cookies.userId })
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// GET single task
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.cookies.userId
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// CREATE task
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description, createdAt } = req.body;

        // 🔥 validation
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const task = new Task({
            title,
            description,
            createdAt: createdAt || new Date(),
            userId: req.cookies.userId
        });

        await task.save();

        console.log("Task saved ✅");

        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// UPDATE task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.cookies.userId
            },
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// TOGGLE completed
app.patch('/api/tasks/:id/toggle', async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.cookies.userId
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.completed = !task.completed;
        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to toggle task' });
    }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.cookies.userId
        });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});


module.exports = app;


if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}














//=======================OLD CODE==================================

// const connectDB = async () => {
//     if (mongoose.connection.readyState === 1) {
//         console.log("Already connected");
//         return;
//     }

//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("DB connected ✅");
//     } catch (err) {
//         console.log("DB ERROR ❌:", err);
//     }
// };

// connectDB();

// app.use(methodOverride('_method'));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cookieParser());


// app.use((req, res, next) => {
//     if (!req.cookies.userId) {
//         res.cookie('userId', crypto.randomUUID(), {
//             maxAge: 365 * 24 * 60 * 60 * 1000,
//             httpOnly: true
//         });
//     }
//     next();
// });



// app.get('/', (req, res) => {
//     // res.render('home');
// });


// app.get('/todo', async (req, res) => {
//     const tasks = await Task.find({ userId: req.cookies.userId });
//     res.json(tasks)
// });


// app.get('/todo/new', (req, res) => {
//     res.render('new');
// });


// app.get('/todo/:id/edit', async (req, res) => {
//     const task = await Task.findOne({ _id: req.params.id, userId: req.cookies.userId });
//     if (!task) return res.redirect('/todo'); //
//     res.render('edit', { task });
// });


// app.post('/todo', async (req, res) => {
//     const { title, description, completed, createdAt } = req.body.task;
//     const task = new Task({
//         title,
//         description,
//         completed,
//         createdAt: createdAt || new Date(),
//         userId: req.cookies.userId
//     });
//     await task.save();
//     console.log("Task saved");
//     res.redirect('/todo');
// });


// app.put('/todo/:id', async (req, res) => {
//     await Task.findOneAndUpdate(
//         { _id: req.params.id, userId: req.cookies.userId },
//         { ...req.body.task },
//         { new: true, runValidators: true }
//     );
//     res.redirect('/todo');
// });


// app.patch('/todo/:id/toggle', async (req, res) => {
//     const task = await Task.findOne({ _id: req.params.id, userId: req.cookies.userId });
//     if (task) {
//         task.completed = !task.completed;
//         await task.save();
//     }
//     res.redirect('/todo');
// });


// app.delete('/todo/:id', async (req, res) => {
//     await Task.findOneAndDelete({ _id: req.params.id, userId: req.cookies.userId });
//     res.redirect('/todo');
// });



// module.exports = app;

// if (process.env.NODE_ENV !== 'production') {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// }