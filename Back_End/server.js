const express = require("express")
const cors = require("cors")
const vm = require("vm")

const app = express()

app.use(cors())
app.use(express.json())

app.post("/review", (req, res) => {

    const code = req.body.code

    try {

        // safe execution (basic JS only)
        const result = vm.runInNewContext(code)

        res.json({
            review: "Execution result: " + result
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