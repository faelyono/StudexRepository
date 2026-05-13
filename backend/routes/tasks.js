const router = require('express').Router();
const auth = require('../middleware/auth');
const { getTasks, createTask, updateTask, deleteTask, completeTask } = require('../controllers/taskController');

router.get('/',              auth, getTasks);
router.post('/',             auth, createTask);
router.put('/:id',           auth, updateTask);
router.delete('/:id',        auth, deleteTask);
router.patch('/:id/complete',auth, completeTask);

module.exports = router;
