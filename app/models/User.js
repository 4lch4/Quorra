const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const userSchema = mongoose.Schema({
  local: {
    username: String,
    password: String
  }
})

userSchema.methods.generateHash = function (pw) {
  return bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null)
}

userSchema.methods.validPassword = function (pw) {
  return bcrypt.compareSync(pw, this.local.password)
}

module.exports = mongoose.model('User', userSchema)
