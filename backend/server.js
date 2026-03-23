const express = require('express')
const app = express()
const port = 8000

app.get("/", (req, res) => {
    res.send("Server side for Health Insurance Caclulator")
})

app.listen(port, () => {
    console.log(`Server listening at port${port}`)
})

// Ping
app.get("/ping", (req, res) => {
    res.json("Server is up and running")
})



// bp category
app.post("/bp-category", (req, res) => {
    const { systolic, diastolic } = req.body
    let category = ""
    let points = 0

    if (systolic < 120 && diastolic < 80) {
        category = "Normal"; points = 0
    } else if (systolic < 130 && diastolic < 80) {
        category = "Elevated"; points = 15
    } else if (systolic < 140 || diastolic < 90) {
        category = "Hypertension Stage 1"; points = 30
    } else if (systolic >= 140 || diastolic >= 90) {
        category = "Hypertension Stage 2"; points = 75
    } else {
        category = "Crisis"; points = 100
    }
    res.json({ category, points })

})

// BMI
app.post("/bmi-category", (req, res) => {
    const { weightLbs, feet, inches } = req.body
    const heightFt = (feet * 12) + inches

    const heightMeters = heightFt * 0.0254
    const weightKg = weightLbs * 0.453592
    const bmi = +(weightKg / ((heightMeters * heightMeters)).toFixed(2))

    let category = ""
    let points = 0

    if (bmi < 18.5) {
        category = "Underweight"; points = 7
    } else if (bmi < 25) {
        category = "Normal"; points = 0
    } else if (bmi < 30) {
        category = "Overweight"; points = 15
    } else if (bmi < 35) {
        category = "Obese"; points = 30
    }
    else {
        category = "Extremely Obese"; points = 75
    }
    res.json({bmi, category, points })
})

// age
app.post("/age-category", (req, res) => {
    const { age } = req.body
    let category = ""
    let points = 0

    if (age < 30) {
        category = "Under 30"; points = 0
    } else if (age < 45) {
        category = "30-44"; points = 10
    } else if (age < 60) {
        category = "45-59"; points = 20
    } else {
        category = "60 and above"; points = 30
    }
    res.json({ category, points })
})


// family diseases. Frontend should include checkboxes for the following three diseases.
app.post("/family-disease", (req, res) => {
    const { familyHistory } = req.body
    let points = 0

    if (familyHistory.includes("diabetes")) {
        points = 10
    }
    if (familyHistory.includes("cancer")) {
        points = 10
    }
    if (familyHistory.includes("alzheimer's")) {
        points = 10
    }

    res.json({ points })
})