const router = require('express').Router();
const auth = require('../middleware/auth');
const { completeSession } = require('../controllers/studyController');

router.post('/complete', auth, completeSession);

module.exports = router;
