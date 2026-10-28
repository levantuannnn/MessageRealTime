const express = require("express");
const port = 8080;
const app = express()
const dotenv = require("dotenv");
dotenv.config();
const router = require("./Routes/auth")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));
app.use("/auth", router)
app.listen(port, function () {
    console.log(`Node server running @ http://localhost:${port}`)
});