const express = require("express");
const path = require("path");
const app = express();
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userInformation');
  console.log("Connection Established");
}


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

const Pasha = new User({userName: 'ctrl', email: "test@gmail.com", password: '123'});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.render('home');
});

app.get("/login", (req, res) => {
  res.render('login')
});

app.get("/register", (req, res) => {
  res.render('signup')
});

app.get('*', (req, res) => {
  res.send('Unknown Path');
});

app.post('/login', (req, res) => {
  console.log(req.body);
  res.send("Post Resposne");
});

app.post('/register', (req, res) => {
  const { userName, email, password} = req.body;

  //res.send(`User: ${userName} Email: ${email} Password: ${password}`);

  res.redirect('/login');
});

app.listen(3000, () => {});
