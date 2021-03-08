const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express()
const axios = require('axios');
const { exec } = require('child_process');
const expressSession = require('express-session');
const cors = require('cors');
const bodyParser= require('body-parser');
const { RSA_NO_PADDING } = require('constants');
const { json } = require('body-parser');
app.use(bodyParser.json());
let port = process.env.PORT || 8080

print("hello World")
app.use(express.static(__dirname))

app.use(expressSession({
    name: "loginCookie",
    secret: ["username"],
    resave: false,
    saveUninitialized: false
}));

app.enable("trust-proxy")

app.post('/login', async (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if (username == undefined || password== undefined) {
        res.json("Unauthorized");
        return;
    }
    let result = await checkLockin(username, password)
    if (result == -1){
        res.json("Incorrect username/password")
        return;
    } else {
        res.json(result)
        return
    } 
})

app.post('/progress', async (req, res) => {
    let course = req.body.course
    let checkpoint = req.body.checkpoint
    return json(-1)
})

app.get('/progress', async (req, res) => {
    let username = req.body.username
    return json(course, checkpoint)
})

//DO NOT USE THIS ONE YET, NOT SURE HOW IT WILL WORK
app.post('/file', async (req, res) => {
    let username = req.body.username
    return json(course, checkpoint)
})

app.post('/createcourse', async (req, res) => {
    let courseID = req.body.courseID
    let students = req.body.students
    let groups = req.body.groups
    let instructors = req.body.instructors
    return json(course, checkpoint)
})

app.post('/addstudenttocourse', async (req, res) => {
    let courseID = req.body.courseID
    let student = req.body.student
    return json(course, checkpoint)
})

app.post('/addgrouptocourse', async (req, res) => {
    let courseID = req.body.courseID
    let group = req.body.group
    return json(course, checkpoint)
})

app.post('/addstudenttogroup', async (req, res) => {
    let studentID = req.body.studentID
    let group = req.body.group
    return json(course, checkpoint)
})

app.post('/removestudentfromcourse', async (req, res) => {
    let courseID = req.body.courseID
    let student = req.body.group
    return json(course, checkpoint)
})

app.post('/removestudentfromgroup', async (req, res) => {
    let groupID = req.body.groupID
    let student = req.body.group
    return json(course, checkpoint)
})

app.post('/removegroupfromcourse', async (req, res) => {
    let groupID = req.body.groupID
    let courseID = req.body.courseID
    return json(course, checkpoint)
})