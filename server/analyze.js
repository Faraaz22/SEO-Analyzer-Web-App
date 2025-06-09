const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
console.log(process.env)


const app = express();
app.use(cors());
app.use(express.json());

// Optional root route for browser testing
app.get("/", (req, res) => {
    res.send("API is running!");
});

app.post("/api/analyze", async (req, res) => {
    console.log("Received body:", req.body);
    const { text } = req.body;
    const apikey = process.env.TEXTRAZOR_API_KEY;

    if (!apikey) {
        return res.status(400).json({ message: "Missing TEXTRAZOR_API_KEY in environment variables." });
    }

    try {
        const response = await axios.post(
            "https://api.textrazor.com/",
            {
            extractors:"entities,topics,words",
            text:text,
            },
            {
                headers: {
                    "x-textrazor-key": apikey,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const data = response.data.response;

        const keywords = {};
        data.entities?.forEach(entity => {
            if (entity.matchedText) {
                const keyword = entity.matchedText.toLowerCase();
                keywords[keyword] = (keywords[keyword] || 0) + 1;
            }
        });

        res.json({
            originalText: text,
            updatedText: text,
            keywords,
            entities: data.entities || [],
            topics: data.topics || [],  
        });
    } catch (err) {
        console.log("Textrazor Error", err.response?.data || err.message);
        res.status(500).json({ message: "Error analyzing text." });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});
