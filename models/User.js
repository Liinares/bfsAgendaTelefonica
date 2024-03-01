const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true
  },
  name: String,
  passwordHash: {
    type: String,
    required: [true, 'User password is required']
  },
  blogs: [{
    type: Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = new model('User', userSchema)

module.exports = User
