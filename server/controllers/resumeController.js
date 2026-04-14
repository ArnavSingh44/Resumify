const Resume = require('../models/resume');
const generatePdfUtil = require('../utils/pdfGenerator');
const { nanoid } = require('nanoid');

exports.createResume = async (req, res) => {
  try {
    const resume = await Resume.create(req.user.id, req.body.data || {});
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.findByUserId(req.user.id);
    res.json(resumes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id, req.user.id);
    if (!resume) return res.status(404).json({ msg: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getPublicResume = async (req, res) => {
    try {
        const resume = await Resume.findByPublicId(req.params.publicId);
        if (!resume) return res.status(404).json({ msg: 'Resume not found or not public' });
        res.json(resume);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.update(req.params.id, req.user.id, req.body.data);
    if (!resume) return res.status(404).json({ msg: 'Resume not found or not authorized' });
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.toggleVisibility = async (req, res) => {
    try {
        const { isPublic } = req.body;
        const publicId = isPublic ? nanoid(10) : null;
        
        const resume = await Resume.updateVisibility(req.params.id, req.user.id, isPublic, publicId);
        if (!resume) return res.status(404).json({ msg: 'Resume not found or not authorized' });
        
        res.json(resume);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteResume = async (req, res) => {
  try {
    await Resume.delete(req.params.id, req.user.id);
    res.json({ msg: 'Resume removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.generatePDF = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id, req.user.id);
    if (!resume) return res.status(404).json({ msg: 'Resume not found' });
    
    // Parse the JSONB data
    const resumeData = typeof resume.data === 'string' ? JSON.parse(resume.data) : resume.data;
    
    const pdfBuffer = await generatePdfUtil(resumeData);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': 'attachment; filename="resume.pdf"'
    });
    
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.cloneResume = async (req, res) => {
  try {
    const original = await Resume.findById(req.params.id, req.user.id);
    if (!original) return res.status(404).json({ msg: 'Original resume not found' });

    // Parse data and add a "Copy" suffix to name if it exists
    const resumeData = typeof original.data === 'string' ? JSON.parse(original.data) : { ...original.data };
    if (resumeData.personalInfo && resumeData.personalInfo.name) {
      resumeData.personalInfo.name = `${resumeData.personalInfo.name} - Copy`;
    }

    const cloned = await Resume.create(req.user.id, resumeData);
    res.json(cloned);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
