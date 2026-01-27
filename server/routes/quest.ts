import express from "express";
import User from "../models/User";
import Video from "../models/Video";
import Quest from "../models/Quest";
import Notification from "../models/Notification";
import auth from "../auth";

const router = express.Router();

// Grab pool of quests for wheel
router.get("/pool", auth.ensureLoggedIn, async (req, res) => {
  try {
    const questpool = await Quest.aggregate([{ $sample: { size: 80 } }]);
    res.send(questpool);
  } catch (error) {
    return res.status(500).send({ error: "Failed to retrieve pool of quests." });
  }
});

// Self-assign
router.post("/assign", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { questid } = req.body;
    const userid = req.user!._id;
    await User.findByIdAndUpdate(userid, {
      $addToSet: { activequests: questid },
    });
    res.send({ success: true, assigned_id: questid });
  } catch (error) {
    return res.status(500).send({ error: "Failed to assign quest." });
  }
});

// Abandon quests
router.post("/abandon", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { questid } = req.body;
    const userid = req.user!._id;
    await User.findByIdAndUpdate(userid, {
      $pull: { activequests: questid },
    });
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: "Failed to abandon quest." });
  }
});

// Verify (Only admins)
router.post("/verify", auth.ensureLoggedIn, async (req, res) => {
  try {
    if (!req.user!.isAdmin) {
      return res.status(403).send({ error: "Unauthorized: Admin access required." });
    }

    const { videoid, statusupdate } = req.body;
    await Video.findByIdAndUpdate(videoid, {
      verification_status: statusupdate,
    });
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: "Failed to verify video" });
  }
});

// Send quest to someone else
router.post("/invite", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { recipientId, questId } = req.body;
    const senderId = req.user!._id;

    if (recipientId === senderId.toString()) {
      return res.status(400).send({ error: "Cannot invite yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (recipient && recipient.activequests.includes(questId)) {
      return res.status(400).send({ error: "User already has this quest." });
    }

    const quest = await Quest.findById(questId);
    const questName = quest ? quest.name : "a quest";

    const notif = new Notification({
      recipient: recipientId,
      type: "QUEST_INVITE",
      senders: [senderId],
      relatedId: questId,
      previewText: `challenged you to: ${questName}`,
    });
    await notif.save();

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: "Failed to send invite" });
  }
});

// Accept quest invite
router.post("/accept", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { notificationId } = req.body;
    const notif = await Notification.findById(notificationId);

    if (!notif) return res.status(404).send({ error: "Invite not found" });
    if (notif.recipient !== req.user!._id.toString()) {
      return res.status(403).send({ error: "Unauthorized" });
    }
    if (notif.type !== "QUEST_INVITE" || !notif.relatedId) {
      return res.status(400).send({ error: "Invalid invite" });
    }

    await User.findByIdAndUpdate(req.user!._id, {
      $addToSet: { activequests: notif.relatedId },
    });

    notif.read = true;
    await notif.save();

    res.send({ success: true, questId: notif.relatedId });
  } catch (err) {
    res.status(500).send({ error: "Failed to accept invite" });
  }
});

// Reject quest
router.post("/reject", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { notificationId } = req.body;
    const notif = await Notification.findById(notificationId);

    if (!notif) return res.status(404).send({ error: "Invite not found" });
    if (notif.recipient !== req.user!._id.toString()) {
      return res.status(403).send({ error: "Unauthorized" });
    }

    // mark as read
    notif.read = true;
    await notif.save();

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: "Failed to reject invite" });
  }
});

// Grab quests
router.get("/active", auth.ensureLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) return res.status(404).send({ error: "User not found" });

    const quests = await Quest.find({ _id: { $in: user.activequests } });

    const videos = await Video.find({
      userid: req.user!._id,
      questid: { $in: user.activequests },
    });

    const questwithstatus = quests.map((quest) => {
      const video = videos.find((v) => v.questid === quest._id.toString());
      return {
        ...quest.toObject(),
        status: video ? video.verification_status : "NOT_STARTED",
      };
    });
    res.send(questwithstatus);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve quests" });
  }
});

export default router;
