const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, farmerController.getAllFarmers);
router.delete('/:id', authenticate, farmerController.deleteFarmer);

module.exports = router;
