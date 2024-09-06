const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const methodOverride = require('method-override');
const User = require("./models/userData");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/userInformation");
  console.log("Connection Established");
}

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "src")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "session-secret-id",
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false },
  })
);

// To be able to display the username for the current session 
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
// Account Page
app.get('/account', (req, res) => {
  const alert = req.query.alert;
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render('account', { alert });
});

// Logout Request
app.post("/logout", (req, res) => {
  //req.session.user = null;
  req.session.destroy();
  res.redirect('/login');
});

app.put('/account', async(req, res) => {
  try {
    const { userName, password } = req.body;
    const existingName = await User.findOne({ userName });
    const user = req.session.user;

    if (existingName) {
      return res.redirect('/account?alert=exists');
    }

    const updateInformation = {};

    // Will only change the Username if thats what's being changed 
    if (userName) {
      updateInformation.userName = userName;
    }

    // Will only change the Password if thats what's being changed 
    if (password) {
      const newHash = await bcrypt.hash(password, 13);
      updateInformation.password = newHash;
    }

    // Retrieves the userid from the database, then updates and saves the new information 
    // to the specific userID
    await User.findByIdAndUpdate(user._id, updateInformation, {new: true});

    //  Updating session data for templating
    req.session.user = await User.findById(user._id);

    res.redirect("/account?alert=success");

  } catch (e) {
    console.log(e);
    res.redirect("/account?alert=error");
  }
});

// Registration + Authentication
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

// For Unknown Paths
app.get("*", (req, res) => {
  res.send("Unknown Path");
});

app.listen(3000, () => {});
