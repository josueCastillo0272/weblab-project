import express from "express";
import Notification from "../models/Notification";
import auth from "../auth";

const router = express.Router();

// grab notifications
router.get("/", auth.ensureLoggedIn, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user!._id })
      .sort({ timestamp: -1 })
      .limit(20);
    res.send(notifications);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch notifications" });
  }
});

// read notification so that badges go away
router.post("/read", auth.ensureLoggedIn, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user!._id, read: false },
      { $set: { read: true } }
    );
    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: "Failed to mark notifications read" });
  }
});

export default router;
