const express = require('express')
const app = express()
const port = 8000

app.get("/", (req, res) => {
    res.send("Server side for Health Insurance Caclulator")
})

app.listen(port, () => {
    console.log(`Server listening at port${port}`)
})