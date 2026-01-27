import express from "express";
import User from "../models/User";
import Video from "../models/Video";
import Quest from "../models/Quest";
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

// Assign quests
router.post("/assign", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { questid } = req.body;
    const userid = req.user._id;
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
    const userid = req.user._id;
    await User.findByIdAndUpdate(userid, {
      $pull: { activequests: questid },
    });
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: "Failed to abandon quest." });
  }
});

// Verify quests
router.post("/verify", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { videoid, statusupdate } = req.body;
    await Video.findByIdAndUpdate(videoid, {
      verification_status: statusupdate,
    });
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: "Failed to verify video" });
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
