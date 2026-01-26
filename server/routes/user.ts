import express from "express";
import User from "../models/User";
import auth from "../auth";

const router = express.Router();

router.post("/update", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { username, bio, profilepicture } = req.body;
    const currentUserId = req.user!._id;

    const duplicate = await User.findOne({ username });

    if (duplicate && duplicate._id.toString() !== currentUserId.toString()) {
      return res.status(400).send({ error: "Username taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(currentUserId, {
      username,
      bio,
      profilepicture,
    });
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
