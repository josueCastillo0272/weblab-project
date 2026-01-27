import express from "express";
import Video from "../models/Video";
import User from "../models/User";
import Like from "../models/Like";
import Comment from "../models/Comment";
import auth from "../auth";

const router = express.Router();

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

router.post("/view", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { videoid } = req.body;
    await User.findByIdAndUpdate(req.user!._id, {
      $addToSet: { viewed_videos: videoid },
    });
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: "Failed to view video." });
  }
});

router.get("/feed", auth.ensureLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) return res.status(404).send({ error: "User not found" });
    const viewedSet = new Set(user.viewed_videos);

    const videos = await Video.find({}).lean();

    const likeCounts = await Like.aggregate([{ $group: { _id: "$parentid", count: { $sum: 1 } } }]);
    const likeMap: Record<string, number> = {};
    likeCounts.forEach((l) => {
      likeMap[l._id] = l.count;
    });

    const commentCounts = await Comment.aggregate([
      { $group: { _id: "$videoid", count: { $sum: 1 } } },
    ]);
    const commentMap: Record<string, number> = {};
    commentCounts.forEach((c) => {
      commentMap[c._id] = c.count;
    });

    videos.sort((a, b) => {
      const vidA = a._id.toString();
      const vidB = b._id.toString();
      const aSeen = viewedSet.has(vidA);
      const bSeen = viewedSet.has(vidB);

      if (aSeen !== bSeen) return aSeen ? 1 : -1;

      const aLikes = likeMap[vidA] || 0;
      const bLikes = likeMap[vidB] || 0;
      if (aLikes !== bLikes) return bLikes - aLikes;

      const aComments = commentMap[vidA] || 0;
      const bComments = commentMap[vidB] || 0;
      return bComments - aComments;
    });

    res.send(videos.slice(0, 100));
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch feed" });
  }
});

router.get("/:id", auth.ensureLoggedIn, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).send({ error: "Video not found" });
    res.send(video);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve video" });
  }
});

export default router;
