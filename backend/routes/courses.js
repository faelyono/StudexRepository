const router = require('express').Router();
const auth = require('../middleware/auth');
const { getCourses, enroll, getLessons } = require('../controllers/courseController');
const { getCards } = require('../controllers/flashcardController');

router.get('/',                              auth, getCourses);
router.post('/enroll/:courseId',             auth, enroll);
router.get('/:id/lessons',                  auth, getLessons);
router.get('/topics/:topicId/flashcards',   auth, getCards);

module.exports = router;
