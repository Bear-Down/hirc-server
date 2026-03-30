const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
// app.use(express.static(__dirname, "index.html"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 1. Ping API (Edward Rodriguez)
app.get("/ping", (req, res) => {
    console.log("Ping request received by server");
    res.json("Server is up and running");
});



// 2. BP-Category API (Kaleb Richardson)
app.post("/api/bp-category", (req, res) => {
    // Safety check: ensure body exists to prevent 500 crash
    if (!req.body) {
        return res.status(400).json({ error: "No data provided" });
    }

    const systolic = parseInt(req.body.systolic);
    const diastolic = parseInt(req.body.diastolic);

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

// 3. BMI API (Sebastian Jaculbe)
app.post("/api/bmi", (req, res) => {
    const { heightFeet, heightInches, weightPounds } = req.body;

    const totalInches = heightFeet * 12 + heightInches;
    const bmi = (weightPounds * 0.453592) / ((totalInches * 0.0254) ** 2);

    let category =
        (bmi < 18.5) ? "underweight" :
        (bmi < 25) ? "normal" :
        (bmi < 30) ? "overweight" :
        (bmi < 35) ? "obese" :
        "extreme obesity";

    console.log("Calculated BMI value and category:", bmi, category);

    res.json({
        bmi: bmi.toFixed(2),
        category
    });
});

// 4. Risk Category API (Kevin Dacanay, Erick Hernandez)
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
    if (familyHistory.includes("alzheimers")) score += 10;

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