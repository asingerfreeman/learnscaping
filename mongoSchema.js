const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  admin: {
    type: Boolean,
    required: [true, 'Admin info is required']
  },
  instructor: {
    type: Boolean,
    required: [true, 'Instructor info is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
})

const courseSchema = new mongoose.Schema({
  students: {
    type: Array,
    required: [false, 'Students can be added later']
  },
  instructors: {
    type: Array,
    required: [true, 'Instructors are required']
  },
  materialLinks: {
    type: Array,
    required: [false, 'Links to materials can be added later']
  }
})

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Material needs searchable name']
  },
  link: {
    type: String,
    required: [true, 'Material must have content']
  }
})



module.exports = userSchema, courseSchema, materialSchema