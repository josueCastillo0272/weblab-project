import express from "express";
import Follow from "../models/Follow";
import User from "../models/User";
import Notification from "../models/Notification";
import auth from "../auth";

const router = express.Router();

router.post("/toggle", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { followingid } = req.body;
    const followerid = req.user!._id;

    if (followingid === followerid.toString()) {
      return res.status(400).send({ error: "Cannot follow yourself" });
    }

    const existingFollow = await Follow.findOne({ followerid, followingid });

    if (existingFollow) {
      await Follow.deleteOne({ _id: existingFollow._id });
      res.send({ following: false });
    } else {
      const newFollow = new Follow({ followerid, followingid });
      await newFollow.save();

      // notifs
      const notif = new Notification({
        recipient: followingid,
        type: "FOLLOW",
        senders: [followerid],
      });
      await notif.save();

      res.send({ following: true });
    }
  } catch (err) {
    res.status(500).send({ error: "Failed to toggle follow" });
  }
});

router.get("/status/:id", auth.ensureLoggedIn, async (req, res) => {
  try {
    const exists = await Follow.findOne({
      followerid: req.user!._id,
      followingid: req.params.id,
    });
    res.send({ following: !!exists });
  } catch (err) {
    res.status(500).send({ error: "Failed to check status" });
  }
});

router.get("/:id/followers", auth.ensureLoggedIn, async (req, res) => {
  try {
    const follows = await Follow.find({ followingid: req.params.id });
    const followerIds = follows.map((f) => f.followerid);
    const users = await User.find({ _id: { $in: followerIds } });
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch followers" });
  }
});

router.get("/:id/following", auth.ensureLoggedIn, async (req, res) => {
  try {
    const follows = await Follow.find({ followerid: req.params.id });
    const followingIds = follows.map((f) => f.followingid);
    const users = await User.find({ _id: { $in: followingIds } });
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch following" });
  }
});

export default router;
