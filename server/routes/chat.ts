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

    const messages = await MSG.find({
      $or: [
        { recipient: recipientid, sender: senderid },
        { recipient: senderid, sender: recipientid },
      ],
    })
      .sort({ timestamp: 1 })
      .populate("replyTo");

    return res.send(messages);
  } catch (error) {
    return res.status(500).send({ error: "Failed to fetch chat history." });
  }
});

// Sends message/reply
router.post("/message", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { recipientid, text, isGIF, replyToId } = req.body;
    if (!req.user || !req.user._id)
      return res.status(401).send({ error: "User/ User ID was not found" });
    const sender: string = req.user._id;

    const newMessage = new MSG({
      sender: sender,
      recipient: recipientid,
      text: text,
      isGIF: isGIF || false,
      timestamp: new Date(),
      replyTo: replyToId || null,
    });

    const savedMessage = await newMessage.save();

    const populatedMessage = await savedMessage.populate("replyTo");

    ChatSocket.sendMessageToRoom(recipientid, sender, populatedMessage);
    return res.send(populatedMessage);
  } catch (error) {
    return res.status(500).send({ error: "Failed to send message" });
  }
});

// React to a message
router.post("/message/react", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { messageId, emoji } = req.body;
    const userId = req.user!._id.toString();

    const message = await MSG.findById(messageId);
    if (!message) return res.status(404).send({ error: "Message not found" });

    const specificReactionGroup = message.reactions.find((r) => r.emoji === emoji);
    const alreadyReactedWithThisEmoji =
      specificReactionGroup && specificReactionGroup.userIds.includes(userId);

    message.reactions.forEach((r) => {
      r.userIds = r.userIds.filter((id) => id !== userId);
    });

    message.reactions = message.reactions.filter((r) => r.userIds.length > 0);

    if (!alreadyReactedWithThisEmoji) {
      const existingReaction = message.reactions.find((r) => r.emoji === emoji);
      if (existingReaction) {
        existingReaction.userIds.push(userId);
      } else {
        message.reactions.push({ emoji, userIds: [userId] });
      }
    }

    await message.save();

    res.send(message);
  } catch (error) {
    res.status(500).send({ error: "Failed to react" });
  }
});

// Find recent conversations
router.get("/overview", auth.ensureLoggedIn, async (req, res) => {
  try {
    const userId = req.user!._id.toString();

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
          lastMessageIsGIF: { $first: "$isGIF" },
          timestamp: { $first: "$timestamp" },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ["$recipient", userId] }, { $eq: ["$read", false] }] }, 1, 0],
            },
          },
        },
      },
      {
        $addFields: {
          recipientObjId: { $toObjectId: "$_id" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipientObjId",
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
          lastMessageIsGIF: 1,
          timestamp: 1,
          unread: "$unreadCount",
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
    console.error(error);
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

// Read status messages
router.post("/read", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { recipientid } = req.body;
    const senderid = req.user._id;

    await MSG.updateMany(
      { sender: recipientid, recipient: senderid, read: false },
      { $set: { read: true } }
    );
    ChatSocket.sendReadReciept(recipientid, senderid);
    res.send({});
  } catch (error) {
    res.status(500).send({ error: "Failed to determine read status." });
  }
});

export default router;
