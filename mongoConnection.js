const mongoose = require('mongoose')
const userSchema = require('./mongoSchema.js')
const User = mongoose.model('user', userSchema, 'user')

const connectionString = 'mongodb+srv://admin:tarheels@cluster0.3vy7r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

async function createUser(username, password) {
  return new User({
    username,
    password
  }).save()
}

async function findUser(username) {
  return await User.findOne({ username })
}

;(async () => {
  const connector = mongoose.connect(connectionString)
  const username = "arisf"
  const password = "arispassword"

  let user = await connector.then(async () => {
    return findUser(username)
  })

  if (!user) {
    user = await createUser(username, password)
  }

  console.log(user)
  process.exit(0)
})()