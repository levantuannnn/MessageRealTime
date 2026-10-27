const express = require("express");
const port = 8000;
const app = express()
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!!!")
});
app.post("auth/login", (req, res) => {
    const { email, password } = req.body;
    res.status(200).res({
        message: "da dang nhap thanh cong"
    })

})
app.get("auth/getlogin", (req, res) => {

})
app.listen(port, function () {
    console.log('Node server running @ http://localhost:3000')
});