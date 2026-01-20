const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');

// Crop Routes
router.post('/crops', authenticate, cropController.createCrop);
router.get('/crops', authenticate, cropController.getUserCrops);
router.put('/crops/:id', authenticate, cropController.updateCrop);
router.delete('/crops/:id', authenticate, cropController.deleteCrop);

// Task Routes
router.post('/tasks', authenticate, taskController.createTask);
router.get('/tasks', authenticate, taskController.getTasks);
router.put('/tasks/:id', authenticate, taskController.updateTask);
router.delete('/tasks/:id', authenticate, taskController.deleteTask);

module.exports = router;
