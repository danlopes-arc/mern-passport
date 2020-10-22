import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hash: {
    type: String,
    required: true
  }
})

UserSchema.virtual('info')
  .get(function() {
    return (({ name, email, _id }) => ({ name, email, id: _id }))(this)
  })

export default mongoose.model('User', UserSchema)