const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');




async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    await client.connect();
    const db = client.db('thewoodwise');
    const Users = db.collection('users');
    const userExists = await Users.findOne({ email: email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await Users.insertOne({
      name: name,
      email: email,
      password: hashedPassword
    });


    res.status(201).json({
      message: "Signup successful",
      user: {
        id: result.insertedId,
        name: name,
        email: email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
  finally {
    await client.close();
  }
}

async function login(req, res) {

  try {

    const { email, password } = req.body;

    // check empty fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    // connect mongodb
    await client.connect();

    // database
    const db = client.db("thewoodwise");

    // collection
    const Users = db.collection("users");

    // find user
    const user = await Users.findOne({
      email: email
    });

    // user not found
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    // wrong password
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // success response
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Login failed"
    });

  }

  finally {

    await client.close();

    console.log("MongoDB connection closed");

  }

}
module.exports = {
  signup,
  login
};
