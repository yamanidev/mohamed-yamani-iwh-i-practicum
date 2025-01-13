require('dotenv').config();

const express = require("express");
const axios = require("axios");
const app = express();

const { CONTACTS_API_URL, EMAIL_REGEX } = require("./constants");

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;

app.get("/", async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
    };

    try {
        const response = await axios.get(`${CONTACTS_API_URL}?properties=full_name,email,age,bio`, { headers });
        const data = response.data.results;
        
        res.render("homepage", { title: "Contacts | Integrating With HubSpot I Practicum", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create contact", details: error.message });
    }
});

app.get("/update-cobj", async (req, res) => {
    try {
        res.render("updates", { title: "Update Custom Object Form | Integrating With HubSpot I Practicum" });
    } catch (error) {
        console.error(error);
    }
});

app.post("/update-cobj", async (req, res) => {
    const { email, full_name, age, bio } = req.body;
    
    if (!email || !EMAIL_REGEX.test(email)) {
        console.log("400 Bad Request: Valid 'email' field is required");
        return res.status(400).json({ error: "Valid email is required"});
    }
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
    };

    try {
        const response = await axios.post(CONTACTS_API_URL, {
            properties: {
                email,
                full_name,
                age,
                bio
            }
        }, { headers });

        console.log("Contact created successfully")
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create contact", details: error.message });
    }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));