const express = require("express");
const path = require("path");
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/userData');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userInformation');
  console.log("Connection Established");
}

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

app.post('/register', async (req, res) => {
  const { userName, email, password} = req.body;

  try {
  const hash = await bcrypt.hash(password, 13);
  const newUser = new User({userName, email, password: hash});
  await newUser.save();

  res.redirect('/login');
  } catch (e) {
    console.log(e);
  }
});

app.listen(3000, () => {});
