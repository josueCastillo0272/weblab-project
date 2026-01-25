import express from "express";
import User from "../models/User";
import auth from "../auth";

const router = express.Router();

router.get("/:id", auth.ensureLoggedIn, async (req, res) => {
  try {
    const targetId = req.params.id;
    const userProfile = await User.findById(targetId);

    if (!userProfile) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send(userProfile);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch profile" });
  }
});

router.post("/update", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { username, bio } = req.body;
    const currentUserId = req.user!._id;

    const duplicate = await User.findOne({ username: username });

    if (duplicate && duplicate._id.toString() !== currentUserId.toString()) {
      return res.status(400).send({ error: "Username taken" });
    }

    await User.findByIdAndUpdate(currentUserId, {
      username: username,
      bio: bio,
    });

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: "Failed to update profile" });
  }
});

export default router;
