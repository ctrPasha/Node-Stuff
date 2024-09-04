const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/userData");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/userInformation");
  console.log("Connection Established");
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "src")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  const alert = req.query.alert;
  res.render("login", { alert });
});

app.get("/register", (req, res) => {
  const alert = req.query.alert;
  res.render("signup", { alert });
});

app.get("*", (req, res) => {
  res.send("Unknown Path");
});

app.listen(3000, () => {});
