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
    "HTTP-Referer": "https://ai-code-reviewer-apol.onrender.com",
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
You are a senior software engineer, senior performance engineer, and computer scientist with 20+ years of experience across systems design, algorithms, security, and code quality.

Respond ONLY in valid JSON format.

{
  "rating": 0,
  "bugs": 0,
  "improvements": 0,
  "review": "",
  "Readability": 0,
  "Algorithmic Complexity": "",
  "nVulnerabilities": 0,
  "Vulnerabilities": "",
  "UIUX": "",
  "Language": ""
}
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

    try {

      const parsed = JSON.parse(
        aiOutput.slice(jsonStart, jsonEnd)
      )

      // Send clean structured data
      res.json(parsed)

    } catch (parseError) {

      console.error(parseError)

      res.status(500).json({
        error: "Invalid AI JSON response",
        raw: aiOutput
      })

    }

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: err.message
    })

  }

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})