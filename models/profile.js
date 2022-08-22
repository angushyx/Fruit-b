const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  avatar: {
    type: String,
  },
  id: {
    type: String,
  },
  //local login *使用者不是選擇 google login 方式，而是選擇本地的 login
  address: {
    type: String,
    maxLength: 1024,
  },

  phoneNumber: {
    type: Number,
  },
  // itemId
  preferItemId: {
    type: String,
  },
})

const User = mongoose.model('user', userSchema)

module.exports = User
