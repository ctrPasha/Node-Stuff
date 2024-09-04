let isSignedIn = false;

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
      isSignedIn = true;
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