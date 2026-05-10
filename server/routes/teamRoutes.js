const express = require('express');
const { createTeam, getTeams } = require('../controllers/teamController');

const router = express.Router();

router.post('/', createTeam);
router.get('/:id', getTeams);

module.exports = router;