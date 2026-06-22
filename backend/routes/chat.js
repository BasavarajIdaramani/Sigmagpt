import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

//test
router.post("/test", async (req, res) => {
    console.log("/api/test request received");
    try {
        const thread = new Thread({
            threadId: Date.now().toString(),
            title: "Test Thread",
        });
        console.log("saving thread", thread);
        const response = await thread.save();
        console.log("thread saved", response._id);
        res.json(response);

    } catch (err) {
        console.error("/api/test error:", err);
        console.error(err.stack);
        res.status(500).send("Server error");
    }
});

router.get("/threads", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

router.get("/threads/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

router.delete("/threads/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });
        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

//final post chat 

router.post("/chat", async (req, res) => {
    console.log("POST /chat received, body:", req.body);
    const { threadId, message } = req.body || {};
    if (!threadId || !message) {
         return res.status(400).json({ error: "threadId and message are required", received: req.body });
    }

    try {
        let thread = await Thread.findOne({threadId});
        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
           
        }

        const assistantReply = await getOpenAIAPIResponse(message);
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = Date.now();
        await thread.save();
        res.json({ reply: assistantReply });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "somehing went wrong" });
    }
});

export default router;