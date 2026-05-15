require("dotenv").config()

const express = require("express")
const cors = require("cors")
const OpenAI = require("openai")

const app = express()

app.use(cors())
app.use(express.json())

// OpenRouter client
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Code Reviewer"
  }
})

app.post("/review", async (req, res) => {

  const code = req.body.code

  try {

    const response = await client.chat.completions.create({
      model: "openrouter/auto",
      messages: [
        {
          role: "system",
          content: `
You are a senior software engineer with 20 plus year of exprience.

Analyze the code and respond ONLY in valid JSON format:

{

  "rating": 0,
  "ratinginpercentage": 0,
  "bugs": 0,
  "improvements": 0,
  "review": ""
  "Readability":0
  "Algorithmic Complexity":""
  "Vulnerabilities": ""
}

Rules:
- rating = score from 1 to 10
- ratinginpercentage = Give a score from 0 to 100
- bugs = number of bugs found
- improvements = number of improvements suggested
- review = give clear explanation keep it compect but not that short
- Return ONLY JSON, no extra text
`
        },
        {
          role: "user",
          content: code
        }
      ]
    })

    // ===== SAFE JSON PARSING =====
    const aiOutput = response.choices[0].message.content

    const jsonStart = aiOutput.indexOf("{")
    const jsonEnd = aiOutput.lastIndexOf("}") + 1

    const parsed = JSON.parse(aiOutput.slice(jsonStart, jsonEnd))

    // Send clean structured data to frontend
    res.json(parsed)

  } catch (err) {
    res.json({
      error: err.message
    })
  }

})

app.listen(3000, () => {
  console.log("Server running on port 3000")
})