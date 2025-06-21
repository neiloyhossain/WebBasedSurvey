import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function askChatGPT(prompt) {
    try {
        const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
    });
    return response.choices[0].message.content;
    } catch (error) {
        console.error("Error with OpenAi API", error);
        return "Error occurred while fetching data from OpenAI"
    }
  }