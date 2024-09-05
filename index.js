const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
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

app.use(
  session({
    secret: "session-secret-id",
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false },
  })
);

// To be able to use templates 
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// Login Page
app.get("/login", (req, res) => {
  const alert = req.query.alert;
  res.render("login", { alert });
});

// Registration Page 
app.get("/register", (req, res) => {
  const alert = req.query.alert;
  res.render("signup", { alert });
});

app.post("/logout", (req, res) => {
  //req.session.user = null;
  req.session.destroy();
  res.redirect('/login');
});

// Registration Authentication
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
    res.redirect("/register?alert=error");
    console.log(e);
  }
});

// Login Authentication
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.redirect("/login?alert=invalid");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.user = user;
      res.redirect("/");
    } else {
      res.status(500).send("Error Logging in");
    }
  } catch (e) {
    console.log(e);
  }
});

//For Unknown Paths
app.get("*", (req, res) => {
  res.send("Unknown Path");
});

app.listen(3000, () => {});
