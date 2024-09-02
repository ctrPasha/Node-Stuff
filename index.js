const express = require("express");
const path = require("path");
const app = express();
const mongoose = require('mongoose');

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
