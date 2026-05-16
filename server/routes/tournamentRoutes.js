const express = require("express");
const {
  createTournament,
  getTournaments,
} = require("../controllers/tournamentController");

const upload = require("../middleware/upload");

const router = express.Router();

router.post(
  "/",
  upload.single("logo"),
  createTournament
);

router.get("/", getTournaments);

module.exports = router;