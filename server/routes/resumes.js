const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route for viewing shared resumes (NO AUTH)
router.get('/public/:publicId', resumeController.getPublicResume);

// Protected routes (AUTH REQUIRED)
router.post('/', authMiddleware, resumeController.createResume);
router.get('/', authMiddleware, resumeController.getResumes);
router.get('/:id', authMiddleware, resumeController.getResumeById);
router.put('/:id', authMiddleware, resumeController.updateResume);
router.delete('/:id', authMiddleware, resumeController.deleteResume);
router.get('/:id/pdf', authMiddleware, resumeController.generatePDF);
router.post('/:id/clone', authMiddleware, resumeController.cloneResume);
router.patch('/:id/visibility', authMiddleware, resumeController.toggleVisibility);

module.exports = router;
