// express server
const express = require("express");
// cors for frontend requests
const cors = require("cors");
// make http requests using axios
const axios = require("axios");
// dotenv to hide api keys
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// acknowledgement message from the server
app.get("/", (req, res) => {
    res.send("API is running!");
});

// post request made to the api
app.post("/api/analyze", async (req, res) => {
    // acknowlegement message for when the API recieves the input text
    console.log("Received body:", req.body);
    // get the text fro request body
    const { text } = req.body;
    // fetch the api key form .env file
    const apikey = process.env.TEXTRAZOR_API_KEY;

    // EDGE CASE: Missing API key
    if (!apikey) {
        return res.status(400).json({ message: "Missing TEXTRAZOR_API_KEY in environment variables." });
    }
    // call the Textrazor API within a try catch block
    try {
        // make a POST request to the Textrazor API to getch entities.topics,words
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
        // return the response from the API
        const data = response.data.response;
        // Build a keywords dictionary
        const keywords = {};
        // fetched each keywords from the entity matchedtext attribute
        // and store it in the keyword dictionary
        data.entities?.forEach(entity => {
            // entity{matchedText} is extracted
            if (entity.matchedText) {
                const keyword = entity.matchedText.toLowerCase();
                keywords[keyword] = (keywords[keyword] || 0) + 1;
            }
        });
        // json result foramt we get orginal text, updated text, keywords,
        // entites, topics, (we will only need the keywords and entites to extract the required info)
        res.json({
            originalText: text,
            updatedText: text,
            keywords,
            entities: data.entities || [],
            topics: data.topics || [],  
        });
    } catch (err) {
        // EDGE CASE: RESPONSE error
        console.log("Textrazor Error", err.response?.data || err.message);
        res.status(500).json({ message: "Error analyzing text." });
    }
});

// check if serber is running on the given port
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});
