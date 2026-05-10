const express = require('express');
const { createPlayer, getPlayers } = require('../controllers/playerController');

const router = express.Router();

router.post('/', createPlayer);
router.get('/:id', getPlayers);

module.exports = router;