import mongoose from "mongoose";
import dotenv from "dotenv";
import Quest from "./models/Quest"; //

dotenv.config({});

// Configuration pulled from your server.ts
const mongoConnectionURL = process.env.MONGO_SRV;
const databaseName = "SideQuest";

const quests = [
  { name: "Jump into a lake or ocean", difficulty: "Hard" },
  { name: "Go cliff jumping (safe + legal)", difficulty: "Hard" },
  { name: "Surf or paddleboard", difficulty: "Hard" },
  { name: "Kayak down a river", difficulty: "Hard" },
  { name: "Go swimming at sunrise", difficulty: "Medium" },
  { name: "Watch the sunrise from a high place", difficulty: "Medium" },
  { name: "Go night swimming", difficulty: "Hard" },
  { name: "Run into the ocean", difficulty: "Medium" },
  { name: "Go snorkeling", difficulty: "Medium" },
  { name: "Go ice skating", difficulty: "Medium" },
  { name: "Try bouldering or rock climbing", difficulty: "Hard" },
  { name: "Hike to a scenic viewpoint", difficulty: "Medium" },
  { name: "Go on a waterfall hike", difficulty: "Medium" },
  { name: "Swim under a waterfall", difficulty: "Hard" },
  { name: "Go trail running", difficulty: "Medium" },
  { name: "Jump rope in a public place", difficulty: "Easy" },
  { name: "Do cartwheels", difficulty: "Medium" },
  { name: "Skateboard down a long path", difficulty: "Medium" },
  { name: "Ride a bike somewhere new", difficulty: "Medium" },
  { name: "Roller skate outdoors", difficulty: "Medium" },
  { name: "Dance in public for 30 seconds", difficulty: "Easy" },
  { name: "Do a cold plunge", difficulty: "Hard" },
  { name: "Go to the beach at night", difficulty: "Medium" },
  { name: "Stargaze away from city lights", difficulty: "Medium" },
  { name: "Do yoga somewhere scenic", difficulty: "Easy" },
  { name: "Take a ferry or boat ride", difficulty: "Hard" },
  { name: "Go kayaking at sunset", difficulty: "Medium" },
  { name: "Try surfing for the first time", difficulty: "Hard" },
  { name: "Go tubing down a river", difficulty: "Hard" },
  { name: "Swim across a pool without stopping", difficulty: "Easy" },
  { name: "Climb a tree", difficulty: "Easy" },
  { name: "Run through a sprinkler or fountain", difficulty: "Easy" },
  { name: "Walk barefoot on sand or grass", difficulty: "Easy" },
  { name: "Do a cannonball off a diving board", difficulty: "Easy" },
  { name: "Go ziplining", difficulty: "Hard" },
  { name: "Jump off a rope swing", difficulty: "Hard" },
  { name: "Do a handstand outside", difficulty: "Medium" },
  { name: "Go sledding or snow tubing", difficulty: "Medium" },
  { name: "Build a snowman", difficulty: "Easy" },
  { name: "Build and jump over a small obstacle course", difficulty: "Medium" },
  { name: "Swim in a natural body of water", difficulty: "Medium" },
  { name: "Hike in the rain", difficulty: "Medium" },
  { name: "Do a flip into water", difficulty: "Hard" },
  { name: "Run up a large hill", difficulty: "Medium" },
  { name: "Go paddleboarding standing up", difficulty: "Hard" },
  { name: "Dance in the ocean waves", difficulty: "Easy" },
  { name: "Walk across stepping stones or rocks", difficulty: "Easy" },
  { name: "Race a friend to a visible landmark", difficulty: "Easy" },
  { name: "Go kayaking", difficulty: "Hard" },
];

const seedDB = async () => {
  if (!mongoConnectionURL) {
    console.error("Error: MONGO_SRV not found in .env file.");
    return;
  }

  try {
    await mongoose.connect(mongoConnectionURL, { dbName: databaseName });
    console.log("Connected to SideQuest database...");

    // Clears existing quests to prevent duplicates if you run this multiple times
    await Quest.deleteMany({});
    console.log("Old quests cleared.");

    await Quest.insertMany(quests);
    console.log(`Successfully injected ${quests.length} quests!`);
  } catch (err) {
    console.error(`Seeding failed: ${err}`);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedDB();
