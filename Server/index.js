const express = require("express");
const port = 8000;
const app = express()
const mysql = require("mysql");
const http = require('http');
const socketIO = require('socket.io')
require('dotenv').config({ path: 'local.env' })
const con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!!!")
});
app.port("auth/login", (req, res) => {
    let sql = "SELECT"
})
app.listen(port, function () {
    console.log('Node server running @ http://localhost:3000')
});