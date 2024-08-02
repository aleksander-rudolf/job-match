const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
  return res.status(200).json({ message: "Server response" });
})

module.exports = { Test: router };