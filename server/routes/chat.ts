import { Message, User } from "../../shared/types";
import express from "express";
import * as auth from "../auth";
import MSG from "../models/Message";
import USER from "../models/User";
import * as ChatSocket from "../services/ChatSocket";

const router = express.Router();
// Returns messages that correspond to messagers
router.get("/history", auth.ensureLoggedIn, async (req, res) => {
  try {
    if (!req.user || !req.user._id)
      return res.status(401).send({ error: "User / User ID was not found" });
    const recipientid: string = req.query.recipient as string;
    const senderid: string = req.user._id;

    const messages: Message[] = await MSG.find({
      $or: [
        { recipient: recipientid, sender: senderid },
        { recipient: senderid, sender: recipientid },
      ],
    }).sort({ timestamp: 1 });

    return res.send(messages);
  } catch (error) {
    return res.status(500).send({ error: "Failed to fetch chat history." });
  }
});

// Sends message
router.post("/message", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { recipientid, text } = req.body;
    if (!req.user || !req.user._id)
      return res.status(401).send({ error: "User/ User ID was not found" });
    const sender: string = req.user._id;
    const newMessage = new MSG({
      sender: sender,
      recipient: recipientid,
      text: text,
      timestamp: new Date(),
    });

    const savedMessage = await newMessage.save();
    ChatSocket.sendMessageToRoom(recipientid, sender, savedMessage);
    return res.send(savedMessage);
  } catch (error) {
    return res.status(500).send({ error: "Failed to send message" });
  }
});

// Find recent conversations
router.get("/overview", auth.ensureLoggedIn, async (req, res) => {
  try {
    const userId = req.user!._id;

    const recentMessages = await MSG.aggregate([
      {
        $match: {
          $or: [{ recipient: userId }, { sender: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$recipient", "$sender"],
          },
          lastMessage: { $first: "$text" },
          timestamp: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "recipient",
        },
      },
      {
        $unwind: "$recipient",
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          timestamp: 1,
          username: "$recipient.username",
          profilepicture: "$recipient.profilepicture",
        },
      },
      {
        $sort: { timestamp: -1 },
      },
    ]);

    res.send(recentMessages);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve overview" });
  }
});

// Search bar - autofill
router.get("/chat/search", auth.ensureLoggedIn, async (req, res) => {
  try {
    const query = req.query.q as string;
    const currentUserId = req.user._id;

    const results = await USER.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: currentUserId },
    })
      .select("_id username profilepicture")
      .limit(10);

    res.send(results);
  } catch (error) {
    res.status(500).send({ error: "Failed to search users" });
  }
});

router.get("/status/:recipient", auth.ensureLoggedIn, async (req, res) => {
  try {
    const recipientid = req.params.recipient;
    const senderid = req.user._id;

    const count = await MSG.countDocuments({
      $or: [
        { recipient: recipientid, sender: senderid },
        { recipient: senderid, sender: recipientid },
      ],
    });
    res.send({ exists: count > 0 });
  } catch (error) {
    res.status(500).send({ error: "Failed to find chat status." });
  }
});
export default router;
