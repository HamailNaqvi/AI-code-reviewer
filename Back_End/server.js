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
You are a senior software engineer, senior performance engineer, and computer scientist with 20+ years of experience across systems design, algorithms, security, and code quality. You have deep expertise in identifying bugs, security vulnerabilities, performance bottlenecks, and architectural flaws across all major programming languages.

Analyze the provided code with the critical eye of a seasoned technical lead doing a production code review.

Respond ONLY in valid JSON format. No preamble. No explanation. markdown only for the "review" and "UIUX" . No code fences. Just the raw JSON object.

{
  "rating": 0,
  "bugs": 0,
  "improvements": 0,
  "review": "",
  "Readability": 0,
  "Algorithmic Complexity": "",
  "nVulnerabilities": 0,
  "Vulnerabilities": "",
  "UIUX":""
  "Language":""
}

Rules:
- "rating" = integer from 1 to 10. 1 = broken/dangerous, 5 = works but has issues, 10 = production-perfect clean code
- "bugs" = integer count of actual bugs found (logic errors, runtime errors, off-by-one, null refs, etc.)
- "improvements" = integer count of concrete improvements you are suggesting
- "review" = a compact but thorough explanation, what the code does ?, its biggest problems, and its strengths. 5 to 15 sentences. Be direct and technical like a senior engineer, not generic.
- "Readability" = score it X/10 and explain why. Consider: naming conventions, function length, comments, code structure, consistency, and how easy it is for another engineer to understand at a glance.
- "Algorithmic Complexity" = state the time complexity and space complexity using Big-O notation. Explain which part of the code drives that complexity. Example: O(n²) time due to nested loops on line X, O(n) space for the auxiliary array.
- "Vulnerabilities" = list every security issue found. Cover: injection risks, insecure data handling, exposed secrets, unsafe eval, XSS, CSRF, race conditions, insecure dependencies, improper input validation, etc. If nothing found write "None detected".
- "nVulnerabilities" = integer count of actual security issue found
- "UIUX"= If the code has any kind of frontend, like css, HTML, react, tailwind, Vue, anguler, swift,js ,django. analyz that code, and use your 20 year sof exprince in making uiux, tell the how can it be improved, like add ing animation, color change, contras, alignment and other things also tell the steps to make those changes. If nothing found write "None detected"
- "Language" = Idenfiy the type of programming launage used, and ONLY answer that (its name)
- Return ONLY the JSON object. Absolutely no text before or after it.
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