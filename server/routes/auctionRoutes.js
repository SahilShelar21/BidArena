const router = require("express").Router();
const controller = require("../controllers/auctionController");

router.post('/bid', controller.placeBid);
router.post('/sell', controller.sellPlayer);
router.get("/state/:id", controller.state);
router.get("/history/:id", controller.history);
router.get("/results/:id", controller.results);

module.exports = router;