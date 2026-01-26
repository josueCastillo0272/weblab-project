import express from "express";
const router = express.Router();
// Routing for modularity

// Auth API
// Contains: login, logout, whoami, initsocket
router.use("/", require("./routes/auth").default);

// Chat API
// Contains: /history, /message
router.use("/", require("./routes/chat").default);

// User API (beyond logging in / out)
// Contains:
router.use("/user", require("./routes/user").default);

// Quest API
// Contains: verify,
router.use("/quest", require("./routes/quest").default);

router.use("/gifs", require("./routes/gifs").default);

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
