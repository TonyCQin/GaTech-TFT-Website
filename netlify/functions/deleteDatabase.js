require("dotenv").config();
const clientPromise = require("./mongodb.js");

const deleteDatabase = async () => {
  const client = await clientPromise;
  const isConnected = await client.topology.isConnected();
  const db = client.db("userdata");
  const collection = db.collection("info");

  try {
    const deleteResult = await collection.deleteMany({});
    console.log("deleted Database");
  } catch (error) {
    console.log("Error deleting, sorting, and reinserting data:", error);
    throw error;
  }
};

deleteDatabase();
