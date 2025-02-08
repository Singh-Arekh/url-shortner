import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import serverless from "serverless-http";  // Serverless HTTP library for Vercel

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connection to DB
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Connection to DB success"))
    .catch((err) => console.error(err, "Not success"));

const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    clicks: { type: Number, default: 0 },
});

const Url = mongoose.model("url", urlSchema);

app.post("/api/short", async (req, res) => {
    try {
        const { originalUrl } = req.body;
        const shortUrl = nanoid(7);
        const url = new Url({ originalUrl, shortUrl });
        await url.save();
        return res.status(200).json({ message: "Generated success", url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Not Generated" });
    }
});

app.get("/:shortUrl", async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl });
        if (url) {
            url.clicks++;
            await url.save();
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json({ error: "URL not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error" });
    }
});

// Wrap the Express app using serverless-http
export default serverless(app);
