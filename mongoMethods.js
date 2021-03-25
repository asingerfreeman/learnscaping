const mongoose = require('mongoose')
const userSchema = require('./mongoSchema.js')
const User = mongoose.model('user', userSchema, 'user')


const connectionString = 'mongodb+srv://admin:tarheels@cluster0.3vy7r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

async function createUser(email, firstName, lastName, password, admin, instructor) {
  if (admin && !instructor) {
    return "Student cannot be admin"
  }
  let existingUser = await User.findOne({"email": email})

  if (existingUser != null){
    return "User with this email already exists"
  }
  return new User({
    email,
    firstName,
    lastName,
    admin,
    instructor, 
    password
  }).save()
}

async function findUser(email, password) {
  return await User.findOne({ "email": email, "password": password})
}



exports.createUser = createUser
exports.findUser = findUser