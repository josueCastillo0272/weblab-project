import express from "express";
const router = express.Router();

router.use("/", require("./routes/auth").default);
router.use("/", require("./routes/chat").default);
router.use("/user", require("./routes/user").default);
router.use("/quest", require("./routes/quest").default);
router.use("/video", require("./routes/video").default);
router.use("/like", require("./routes/like").default);
router.use("/comment", require("./routes/comment").default);
router.use("/follow", require("./routes/follow").default);
router.use("/notifications", require("./routes/notification").default);
router.use("/gifs", require("./routes/gifs").default);

router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
