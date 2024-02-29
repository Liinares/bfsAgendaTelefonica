const { Schema, model } = require('mongoose')

const blogSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required']
  },
  author: String,
  url: {
    type: String,
    required: [true, 'Blog url is required']
  },
  likes: {
    type: Number,
    default: 0
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = new model('Blog', blogSchema)

module.exports = Blog
