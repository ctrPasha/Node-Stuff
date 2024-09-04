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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.redirect("/login?alert=invalid");
    }
    
    const isMatch = await bcrypt.compare(password, user.password);


    if (isMatch) {
      res.redirect("/login?alert=success");
    } else {
      res.status(500).send("Error Logging in");
    }
  } catch (e) {
    console.log(e);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existingEmail = await User.findOne({ email });
    const existingUserName = await User.findOne({ userName });

    if (existingEmail || existingUserName) {
      return res.redirect("/register?alert=exists");
    }


    const hash = await bcrypt.hash(password, 13);
    const newUser = new User({ userName, email, password: hash });
    await newUser.save();

    res.redirect("/register?alert=success");
  } catch (e) {
    res.redirect("/register?alert=error");w
    console.log(e);
  }
});

app.listen(3000, () => {});
