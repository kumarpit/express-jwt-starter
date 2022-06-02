import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.model.js";
import { authenticateToken, generateAccessToken, generateRefreshToken } from "./auth.js";

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/express-auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully")
})

app.post('/user', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: username,
            password: hash
        })
        const data = await newUser.save();

        res.status(200).json({
            message: "Successfully created user",
            data,
        });

    } catch(err) {
        if (err.hasOwnProperty("code") && err.code == 11000) {
            res.status(400).json("Username already exists");
        }
        else res.status(500).json(err);
    }
})

app.post('/login', async (req, res) => {
    try {
        if (!(req.body.username && req.body.password)) res.status(400).json("Invalid request body");
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        
        if (!user) return res.status(400).json("user doesn't exist");

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json("invalid username or password");
        
        const accessToken = generateAccessToken({ username: username });
        const refreshToken = generateRefreshToken({ username: username });

        res.json({ access_token: accessToken, refreshToken: refreshToken });
    } catch (err) {
        res.status(500).json(err);
    }
})

app.get('/echo', authenticateToken, (req, res) => {
    res.status(200).json({ message: `Hello, ${req.user.username}`});
})

app.listen(3000);