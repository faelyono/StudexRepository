const router = require('express').Router();
const auth = require('../middleware/auth');
const { getGlobal, getCourse } = require('../controllers/leaderboardController');

router.get('/global',       auth, getGlobal);
router.get('/course/:id',   auth, getCourse);

module.exports = router;
