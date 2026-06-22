import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";



const app = express();
const PORT = 2000;

app.use(express.json());
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

app.use("/api", chatRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    connectDB();
}); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log("Connected with Database");
        
    } catch (err) {
        console.log("Failed to connect with Database", err);
    }
}

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.post("/test", async (req, res) => {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: "hi" }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API Error:", data);
            return res.status(response.status).json({
                error: "Groq API Error",
                details: data
            });
        }

        res.status(200).json(data);

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).send("Internal Server Error");
    }
}); 

