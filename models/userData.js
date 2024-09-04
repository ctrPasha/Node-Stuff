const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String, 
    required: true, 
    unique: true, 
    minLength: 5,
    maxLength: 15,
    match: /^[a-zA-Z0-9]*$/ 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: {
    type: String, 
    required: true 
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
