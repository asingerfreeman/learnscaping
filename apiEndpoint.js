const mongoose = require("mongoose");
const userSchema = require("./mongoSchema.js");
const mongoMethods = require("./mongoMethods");

const express = require("express");
const app = express();
const axios = require("axios");
const { exec } = require("child_process");
const expressSession = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const { RSA_NO_PADDING } = require("constants");
const { json } = require("body-parser");
app.use(bodyParser.json());
const utils = require("./utils")
let port = process.env.PORT || 8080


app.use(express.static(__dirname));

app.use(
  expressSession({
    name: "loginCookie",
    secret: ["username"],
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.enable("trust-proxy");

const connectionString =
  "mongodb+srv://admin:tarheels@cluster0.3vy7r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const User = mongoose.model("user", userSchema, "user");

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

app.post("/createuser", async (req, res) => {
  console.log("called");
  let email = req.body.email;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let admin = req.body.admin;
  let instructor = req.body.instructor;
  let password = req.body.password;
  res.json(
    await mongoMethods.createUser(
      email,
      firstName,
      lastName,
      password,
      admin,
      instructor
    )
  );
});

app.post("/login", async (req, res) => {
  console.log("called");
  console.log(res.getHeaders());
  let result = await mongoMethods.checkLogin(
    req.body.username,
    req.body.password
  );

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (result == null) {
    res.status(402).json(result);
  } else if (req.body.username == undefined || req.body.password == undefined) {
    res.status(400).json(result);
  } else if (result == "username does not exist") {
    res.status(401).json(result);
  } else {
    res.status(200).json(result);
  }
});

app.post("/progress", async (req, res) => {
  let course = req.body.course;
  let checkpoint = req.body.checkpoint;
  return json(-1);
});

app.get("/progress", async (req, res) => {
  let username = req.body.username;
  return json(course, checkpoint);
});

//DO NOT USE THIS ONE YET, NOT SURE HOW IT WILL WORK

app.post("/file", async (req, res) => {
  let username = req.body.username;
  return json(course, checkpoint);
});

app.post("/createcourse", async (req, res) => {
  let courseID = req.body.courseID;
  let students = req.body.students;
  let groups = req.body.groups;
  let instructors = req.body.instructors;
  return json(course, checkpoint);
});

app.post("/createlogin", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  createUser(username, "firstName", "lastName", password, false, false)
  return json(true);
});

app.post("/addstudenttocourse", async (req, res) => {
  let courseID = req.body.courseID;
  let student = req.body.student;
  return json(course, checkpoint);
});

app.post("/addgrouptocourse", async (req, res) => {
  let courseID = req.body.courseID;
  let group = req.body.group;
  return json(course, checkpoint);
});

app.post("/addstudenttogroup", async (req, res) => {
  let studentID = req.body.studentID;
  let group = req.body.group;
  return json(course, checkpoint);
});

app.post("/removestudentfromcourse", async (req, res) => {
  let courseID = req.body.courseID;
  let student = req.body.group;
  return json(course, checkpoint);
});

app.post("/removestudentfromgroup", async (req, res) => {
  let groupID = req.body.groupID;
  let student = req.body.group;
  return json(course, checkpoint);
});

app.post("/removegroupfromcourse", async (req, res) => {
  let groupID = req.body.groupID;
  let courseID = req.body.courseID;
  return json(course, checkpoint);
});

/*api endpoints for interacting with firebase for files*/

/*send the filename of the file created as a header in the format:
filename: "filename.filetype"
retrieves link to a file meant for media
*/
app.get("/file", async(req,res)=> {
    await utils.getLinkToFile(req.get('filename')).then((result)=> {
        res.send(result)
    }).catch((err)=> {
        console.log(err)
    })
})
/**
 * send the file path as a header in the format filepath: "filepath.filetype"
 * posts to google storage
 * meant for uploading media files like jpg, mp4 etc
 */
app.post("/media", async(req,res)=> {
    await utils.uploadFile(req.get('filepath')).then((result)=> {
        res.send("File upload successful")
    }).catch((err)=> {
        console.log(err)
    })
})

app.delete('/file', async(req,res)=> {
    await utils.deleteFile(req.get('filename')).then((result)=> {
        res.send("File deleted")
    }).catch((err)=> {
        console.log(err)
    })
})

//returns a json object of the specified coursename with all of the course text content
/**
 * send the coursename as a header in the format coursename: "name of course"
 */
app.get('/coursedata', async(req, res)=> {
    await utils.getWebpageData(req.get('coursename')).then((result)=>{
        res.send(result)
    }).catch((err)=> {
        console.log(err)
    })
})

app.listen(port, () => {
  console.log("Learnscaping up and running on port " + port);
});
