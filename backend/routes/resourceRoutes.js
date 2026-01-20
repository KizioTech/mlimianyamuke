const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', resourceController.getAllResources);
router.post('/', authenticate, upload.single('file'), resourceController.createResource);
router.delete('/:id', authenticate, resourceController.deleteResource);

module.exports = router;
