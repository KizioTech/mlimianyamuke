const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// Public
router.get('/stats', adminController.getPublicStats);
router.post('/analytics/track', adminController.trackPageView);
router.get('/testimonials/featured', adminController.getFeaturedTestimonials);

// Admin / Auth Required
router.get('/testimonials', authenticate, adminController.getTestimonials); // Admins see all
router.post('/testimonials', authenticate, isAdmin, adminController.createTestimonial);
router.delete('/testimonials/:id', authenticate, isAdmin, adminController.deleteTestimonial);
router.put('/testimonials/:id', authenticate, isAdmin, adminController.updateTestimonial);

router.get('/analytics/dashboard', authenticate, isAdmin, adminController.getAdminAnalytics);

// Farmer Management
router.get('/farmers/:id/details', authenticate, isAdmin, adminController.getFarmerDetails);
router.post('/farmers/:id/message', authenticate, isAdmin, adminController.sendMessageToFarmer);

module.exports = router;
