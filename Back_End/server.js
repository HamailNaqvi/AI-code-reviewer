const express = require("express")
const cors = require("cors")
const OpenAI = require("openai")

const app = express()

app.use(cors())
app.use(express.json())

// OpenRouter client
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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"
})

app.post("/review", async (req, res) => {

  const code = req.body.code

  try {

    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",   // you can change model later
      messages: [
        {
          role: "system",
          content: `
You are a senior software engineer.
Review the code and give:
1. Bugs (if any)
2. Improvements
3. Best practices
Keep it simple and clear.
also keep it short.
          `
        },
        {
          role: "user",
          content: code
        }
      ]
    })

    res.json({
      review: response.choices[0].message.content
    })

  } catch (err) {

    res.json({
      review: "Error: " + err.message
    })

  }

})

app.listen(3000, () => {
  console.log("Server running on port 3000")
})