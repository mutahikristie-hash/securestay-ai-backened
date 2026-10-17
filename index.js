const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data));

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || "Sorry, I couldn't generate a response right now.";

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('SecureStay AI backend is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));