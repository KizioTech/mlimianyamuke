const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// Comments (Public to view, Auth to post)
router.get('/comments/:postId', interactionController.getPostComments);
router.post('/comments', authenticate, interactionController.createComment);

// Consultations (Auth to request/view own, Admin to view all)
router.post('/consultations', authenticate, interactionController.createConsultation);
router.get('/consultations/mine', authenticate, interactionController.getUserConsultations);
router.get('/consultations/all', authenticate, isAdmin, interactionController.getAllConsultations);

// Farm Reports (Auth to report/view own, Admin to view all)
router.post('/reports', authenticate, interactionController.createFarmReport);
router.get('/reports/mine', authenticate, interactionController.getUserReports);
router.get('/reports/all', authenticate, isAdmin, interactionController.getAllReports);

// Admin Actions
router.put('/consultations/:id', authenticate, isAdmin, interactionController.updateConsultation);
router.put('/reports/:id', authenticate, isAdmin, interactionController.updateReport);

module.exports = router;
