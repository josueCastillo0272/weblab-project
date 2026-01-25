import { Message } from "../../shared/types";
import express from "express";
const router = express.Router();

import * as auth from "../auth";
import Msg from "../models/Message";
import * as ChatSocket from "../services/ChatSocket";
// Returns messages that correspond to messagers
router.get("/history", auth.ensureLoggedIn, async (req, res) => {
  try {
    if (!req.user || !req.user._id)
      return res.status(401).send({ error: "User/ User ID was not found" });
    const recipientid: string = req.query.recipient as string;
    const senderid: string = req.user._id;

    const messages: Message[] = await Msg.find({
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
    const newMessage = new Msg({
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

export default router;
