import mongoose from "mongoose";
import dotenv from "dotenv";

// Import all your models
import Comment from "./models/Comment";
import Follow from "./models/Follow";
import Like from "./models/Like";
import Message from "./models/Message";
import Quest from "./models/Quest";
import Video from "./models/Video";
import User from "./models/User";

dotenv.config({});

const mongoConnectionURL = process.env.MONGO_SRV;
const databaseName = "SideQuest"; // Matches your server configuration

if (mongoConnectionURL === undefined) {
  throw new Error("Please add the MongoDB connection SRV as 'MONGO_SRV'");
}

const clearDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(mongoConnectionURL, {
      dbName: databaseName,
    });
    console.log("Connected to MongoDB...");

    // Delete all documents from each collection
    console.log("Clearing collections...");
    await Promise.all([
      Comment.deleteMany({}),
      Follow.deleteMany({}),
      Like.deleteMany({}),
      Message.deleteMany({}),
      Quest.deleteMany({}),
      Video.deleteMany({}),
      User.deleteMany({}),
    ]);

    console.log("Database cleared successfully!");
  } catch (err) {
    console.error(`Error clearing database: ${err}`);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

clearDatabase();
