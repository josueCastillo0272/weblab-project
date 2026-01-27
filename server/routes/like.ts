import express from "express";
import Like from "../models/Like";
import auth from "../auth";

const router = express.Router();

router.post("/toggle", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { parentid } = req.body;
    const userid = req.user!._id;

    const existingLike = await Like.findOne({ parentid, userid });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      res.send({ liked: false });
    } else {
      const newLike = new Like({ parentid, userid });
      await newLike.save();
      res.send({ liked: true });
    }
  } catch (err) {
    res.status(500).send({ error: "Failed to toggle like" });
  }
});

router.get("/count/:parentid", async (req, res) => {
  try {
    const count = await Like.countDocuments({ parentid: req.params.parentid });
    res.send({ count });
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch count" });
  }
});

export default router;
