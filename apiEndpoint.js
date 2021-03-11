const mongoose = require('mongoose')
const userSchema = require('./mongoSchema.js')
const mongoMethods = require('./mongoMethods')

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

app.use(express.static(__dirname))

app.use(expressSession({
    name: "loginCookie",
    secret: ["username"],
    resave: false,
    saveUninitialized: false
}));

app.enable("trust-proxy")

const connectionString = 'mongodb+srv://admin:tarheels@cluster0.3vy7r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const User = mongoose.model('user', userSchema, 'user')

;(async () => {
  const connector = mongoose.connect(connectionString, { useNewUrlParser: true , useUnifiedTopology: true})
  const email = "arisf@Live.unc.edu"
  const firstName = "Ari"
  const lastName = "Singer-Freeman"
  const admin = true
  const instructor = true
  const password = "arispassword"


  let user = await connector.then(async () => {
    return mongoMethods.findUser(email)
  })

  if (!user) {
    user = await mongoMethods.createUser(email, firstName, lastName, admin, instructor, password)
  }

  

  app.post('/login', async (req, res) => {
    let email = req.body.email
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let admin = req.body.admin
    let instructor = req.body.instructor
    let password = req.body.password
    res.json(createUser(email, firstName, lastName, admin, instructor, password))
  })

  


  console.log(user)
  app.listen(port, () => {
    console.log("Learnscaping up and running on port " + port);
  });
  process.exit(0)
})()


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

app.post('/createlogin', async (req, res) => {
    let studentOrInstructor = req.body.studentOrInstructor
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email
    return json(true)
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


