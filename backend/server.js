import OpenAI from "openai";
import express from "express";
import cors from "cors";
import 'dotenv/config';

const app = express();
app.use(cors()); 
app.use(express.json());
const API = process.env.OPEN_API

const openai = new OpenAI({
  apiKey: API,
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log(req.body)
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: message }
      ]
    });

    const responseMessage = completion.choices[0]?.message?.content || "No response from model";
    res.json({ message: responseMessage });

  } catch (err) {
    console.error("Error in /chat:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
