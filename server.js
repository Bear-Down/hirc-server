const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(express.static(__dirname, "index.html"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 1. Ping API (...)
app.get("/ping", (req, res) => {
    console.log("Ping recevied")
    res.json("Server is up and running")
})



// 2. BP-Category API (...)
app.post("/api/bp-category", (req, res) => {
    const { systolic, diastolic } = req.body;

    let category = "";

    if (systolic > 180 || diastolic > 120) {
        category = "crisis";
    } else if (systolic >= 140 || diastolic >= 90) {
        category = "stage 2";
    } else if (systolic >= 130 || diastolic >= 80) {
        category = "stage 1";
    } else if (systolic >= 120 && diastolic < 80) {
        category = "elevated";
    } else {
        category = "normal";
    }

    console.log("BP Category calculated:", category);

    res.json({ category });
});

// 3. BMI API (...)
app.post("/api/bmi", (req, res) => {
    const { heightFeet, heightInches, weightPounds } = req.body;

    const totalInches = (heightFeet * 12) + heightInches;
    const heightMeters = totalInches * 0.0254;
    const weightKg = weightPounds * 0.453592;

    const bmi = weightKg / (heightMeters ** 2);

    let category = "";

    if (bmi < 18.5) category = "underweight";
    else if (bmi < 25) category = "normal";
    else if (bmi < 30) category = "overweight";
    else if (bmi < 35) category = "obese";
    else category = "extreme obesity";

    console.log("BMI calculated:", bmi, category);

    res.json({
        bmi: bmi.toFixed(2),
        category
    });
});

// 4. Risk Category API (...)
app.post("/api/risk-category", (req, res) => {
    const { age, bmiCategory, bpCategory, familyHistory } = req.body;

    let score = 0;

    // Age
    if (age < 30) score += 0;
    else if (age < 45) score += 10;
    else if (age < 60) score += 20;
    else score += 30;

    // BMI
    if (bmiCategory === "normal") score += 0;
    else if (bmiCategory === "overweight") score += 30;
    else if (bmiCategory === "obese") score += 75;

    // Blood Pressure
    switch (bpCategory) {
        case "normal": score += 0; break;
        case "elevated": score += 15; break;
        case "stage 1": score += 30; break;
        case "stage 2": score += 75; break;
        case "crisis": score += 100; break;
    }

    // Family History
    if (familyHistory.includes("diabetes")) score += 10;
    if (familyHistory.includes("cancer")) score += 10;
    if (familyHistory.includes("alzheimer")) score += 10;

    // Risk Category
    let risk = "";

    if (score <= 20) risk = "low risk";
    else if (score <= 50) risk = "moderate risk";
    else if (score <= 75) risk = "high risk";
    else risk = "uninsurable";

    console.log("Risk calculated:", score, risk);

    res.json({
        score,
        risk
    });
});


app.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})