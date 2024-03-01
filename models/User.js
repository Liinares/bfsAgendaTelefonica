const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
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

const User = new model('User', userSchema)

module.exports = User
