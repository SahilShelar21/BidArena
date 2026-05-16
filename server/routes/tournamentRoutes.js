const express = require("express");
const {
  createTournament,
  getTournaments,
} = require("../controllers/tournamentController");

const upload = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/",
  upload.single("logo"),
  createTournament
);

router.get("/", getTournaments);

module.exports = router;