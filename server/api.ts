import express from "express";
const router = express.Router();
// Routing for modularity
router.use("/", require("./routes/auth").default);
router.use("/", require("./routes/message").default);

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
