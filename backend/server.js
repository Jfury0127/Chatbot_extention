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
    const { history } = req.body;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ error: "History is required and must be an array" });
    }

    const openAiMessages = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openAiMessages
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
