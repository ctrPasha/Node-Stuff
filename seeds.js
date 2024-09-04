const mongoose = require("mongoose");

const User = require("./models/userData");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/userInformation");
  console.log("Connection Established");
}

const seedUsers = [
  {
    userName: "testName2",
    email: "test12@gmail.com",
    password: "1234",
  },

  {
    userName: "testname1",
    email: "test2@gmail.com",
    password: "12344",
  },

  {
    userName: "testnAme3",
    email: "test3@gmail.com",
    password: "123445",
  },
];

User.insertMany(seedUsers)
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  });
