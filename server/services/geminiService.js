import axios from 'axios';

const GEMINI_API_URL = "https://gemini.googleapis.com/v1/chat/completions";

export async function callGeminiAI(prompt) {
  try {
    console.log("Sending prompt to Gemini AI:", prompt);

    const response = await axios.post(
      GEMINI_API_URL,
      {
        model: "gemini-1",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Received Gemini response:", response.data);

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Gemini API call failed:", error.response?.data || error.message);
    throw error;
  }
}
