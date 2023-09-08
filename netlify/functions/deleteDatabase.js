require("dotenv").config();
const clientPromise = require("./mongodb.js");

const sortDatabase = async () => {
  const client = await clientPromise;
  const isConnected = await client.topology.isConnected();
  const db = client.db("userdata");
  const collection = db.collection("info");

  try {
    const deleteResult = await collection.deleteMany({});
  } catch (error) {
    console.log("Error deleting, sorting, and reinserting data:", error);
    throw error;
  }
};

sortDatabase();
