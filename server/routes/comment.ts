import express from "express";
import Comment from "../models/Comment";
import Video from "../models/Video";
import Notification from "../models/Notification";
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

    // notifications
    const video = await Video.findById(videoid);
    if (video && video.userid !== req.user!._id.toString()) {
      const notif = new Notification({
        recipient: video.userid,
        type: "COMMENT",
        senders: [req.user!._id],
        relatedId: videoid,
        previewText: text.length > 20 ? text.substring(0, 20) + "..." : text,
      });
      await notif.save();
    }

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
