const mongoose = require('mongoose')
const userSchema = require('./mongoSchema.js')
const User = mongoose.model('user', userSchema, 'user')


const connectionString = 'mongodb+srv://admin:tarheels@cluster0.3vy7r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

async function createUser(email, firstName, lastName, admin = false, instructor = false, password) {
  if (admin && !instructor) {
    return "Failure"
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

async function findUser(email) {
  return await User.findOne({ email })
}



exports.createUser = createUser
exports.findUser = findUser