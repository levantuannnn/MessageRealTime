const express = ("express");
const port = 8000;
const app = express()
const mysql = require("mysql");
const http = require('http');
const socketIO = require('socket.io')

const con = mysql.createConnection({
    host: "localhost",
    user: "your_user",
    password: "your_password",
    database: "your_database"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!!!")
});
app.port("auth/login", (req, res) => {
    let sql = "SELECT"
})
app.listen(3000, function () {
    console.log('Node server running @ http://localhost:3000')
});