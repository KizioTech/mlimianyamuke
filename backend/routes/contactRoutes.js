const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, contactController.getAllContacts);
router.delete('/:id', authenticate, contactController.deleteContact);

module.exports = router;
