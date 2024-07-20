const express = require("express");
const router = express.Router();

const votes = require("../controllers/votes.controller");

router.get("/votes", votes.loadAllVotes);

module.exports = router;
