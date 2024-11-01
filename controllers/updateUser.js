///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////THIS IS JUST FOR TESTING TO INSERT THE PROFILE DATA INTO THE USER DATA TABLE///////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const User = require("../models/User");

const client = new MongoClient(process.env.MONGO_URI);

async function addSingleDocument(req, res) {
  try {
    await client.connect();

    const database = client.db("test");
    const collection = database.collection("users");

    const userId = "65649f9338776bf957e36b32"; //req.payload._id;
    const { city, country, phone, bankName, accountNumber } = req.body;

    const user = await User.find({ _id: userId });

    if (!user)
      res.status(400).json({ success: false, message: "User not find" });

    const documentToAdd = {
      updatedUser: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      city,
      country,
      phone,
      bankName,
      accountNumber,
    };

    console.log(documentToAdd);

    // const result = await collection.insertOne(documentToAdd);
    // console.log(`Document added with _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

module.exports = addSingleDocument;
