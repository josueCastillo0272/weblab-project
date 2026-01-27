import express from "express";
import Comment from "../models/Comment";
import auth from "../auth";

const router = express.Router();

router.post("/", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { videoid, text, parentid } = req.body;
    const newComment = new Comment({
      videoid,
      userid: req.user!._id,
      text,
      parentid: parentid || null,
    });
    await newComment.save();
    res.send(newComment);
  } catch (err) {
    res.status(500).send({ error: "Failed to post comment" });
  }
});

router.get("/:videoid", auth.ensureLoggedIn, async (req, res) => {
  try {
    const comments = await Comment.find({ videoid: req.params.videoid }).sort({ timestamp: 1 });
    res.send(comments);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch comments" });
  }
});

export default router;
