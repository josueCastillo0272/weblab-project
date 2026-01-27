import express from "express";
import User from "../models/User";
import Video from "../models/Video";
import auth from "../auth";

const router = express.Router();

// post video
router.post("/", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { questid, videourl } = req.body;
    const newVideo = new Video({
      userid: req.user!._id,
      questid,
      videourl,
    });
    const savedVideo = await newVideo.save();
    res.send(savedVideo);
  } catch (error) {
    res.status(500).send({ error: "Failed to post video" });
  }
});

// gather feed
router.get("/feed", auth.ensureLoggedIn, async (req, res) => {
  try {
    const videos = await Video.find({ $limit: 100 });
    res.send(videos);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch feed" });
  }
});

router.get("/:id", auth.ensureLoggedIn, async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch video" });
  }
});

export default router;
