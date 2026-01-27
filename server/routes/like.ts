import express from "express";
import Like from "../models/Like";
import Video from "../models/Video";
import Comment from "../models/Comment";
import Notification from "../models/Notification";
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

      // notify
      const video = await Video.findById(parentid);
      const comment = video ? null : await Comment.findById(parentid);

      const recipientId = video?.userid || comment?.userid;

      if (recipientId && recipientId !== userid.toString()) {
        // like instagram - Instead of new notif
        const existingNotif = await Notification.findOne({
          recipient: recipientId,
          type: "LIKE",
          relatedId: parentid,
          read: false,
        });

        if (existingNotif) {
          await Notification.findByIdAndUpdate(existingNotif._id, {
            $addToSet: { senders: userid },
            timestamp: new Date(),
          });
        } else {
          const notif = new Notification({
            recipient: recipientId,
            type: "LIKE",
            senders: [userid],
            relatedId: parentid,
          });
          await notif.save();
        }
      }

      res.send({ liked: true });
    }
  } catch (err) {
    console.error(err);
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
