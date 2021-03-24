const mongoose = require('mongoose')
const userSchema = require('./mongoSchema.js')
const User = mongoose.model('user', userSchema, 'user')


const connectionString = 'mongodb+srv://admin:tarheels@cluster0.3vy7r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

async function createUser(username, firstName, lastName, password, admin, instructor) {
  if (admin && !instructor) {
    return "Student cannot be admin"
  }
  let existingUser = await User.findOne({"username": username})

  if (existingUser != null){
    return "User with this email already exists"
  }
  return new User({
    username,
    firstName,
    lastName,
    admin:false,
    instructor: false, 
    password
  }).save()
}

async function checkLogin(username, password) {
  if (UserfindOne({"username":username}) == null){
    return "username does not"
  }
  return await User.findOne({ "username": username, "password": password})
}



exports.createUser = createUser
exports.checkLogin = checkLogin