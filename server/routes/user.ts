import express from "express";
import User from "../models/User";
import Video from "../models/Video";
import auth from "../auth";

const router = express.Router();

// Grab top 50 users from leaderboard
router.get("/leaderboard", auth.ensureLoggedIn, async (req, res) => {
  try {
    const top = await Video.aggregate([
      { $match: { verification_status: "APPROVED" } },
      { $group: { _id: "$userid", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    const userIds = top.map((user) => user._id);
    const users = await User.find({ _id: { $in: userIds } });

    const leaderboard = top.map((entry) => {
      const user = users.find((u) => u._id.toString() === entry._id.toString());
      return {
        _id: entry._id,
        count: entry.count,
        username: user?.username,
        profilepicture: user?.profilepicture,
      };
    });
    res.send(leaderboard);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch leaderboard" });
  }
});

router.get("/username/:username", auth.ensureLoggedIn, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (err) {
    res.status(500).send({ error: "Could not fetch username." });
  }
});

// specifically for updating
router.post("/update", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { username, bio, profilepicture } = req.body;
    const currentUserId = req.user!._id;

    const duplicate = await User.findOne({ username });

    if (duplicate && duplicate._id.toString() !== currentUserId.toString()) {
      return res.status(400).send({ error: "Username taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      {
        username,
        bio,
        profilepicture,
      },
      { new: true }
    );
    req.session.user = updatedUser;

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: "Failed to update profile" });
  }
});
router.get("/:id", auth.ensureLoggedIn, async (req, res) => {
  try {
    const userProfile = await User.findById(req.params.id);
    if (!userProfile) return res.status(404).send({ error: "Not found" });
    res.send(userProfile);
  } catch (err) {
    res.status(500).send({ error: "Error" });
  }
});

export default router;
