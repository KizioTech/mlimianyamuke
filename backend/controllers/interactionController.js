const { Comment, Consultation, FarmReport, User, Post } = require('../models');

// Comments
exports.createComment = async (req, res) => {
    try {
        const { content, PostId } = req.body;
        const comment = await Comment.create({
            content,
            PostId,
            UserId: req.user.id
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment' });
    }
};

exports.getPostComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: { PostId: req.params.postId },
            include: [{ model: User, attributes: ['username'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments' });
    }
};

// Consultations
exports.createConsultation = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const consultation = await Consultation.create({
            subject,
            message,
            UserId: req.user.id
        });
        res.status(201).json(consultation);
    } catch (error) {
        res.status(500).json({ message: 'Error requesting consultation' });
    }
};

exports.getUserConsultations = async (req, res) => {
    try {
        const consultations = await Consultation.findAll({
            where: { UserId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(consultations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching consultations' });
    }
};

// Farm Reports
exports.createFarmReport = async (req, res) => {
    try {
        const { problemType, description, location } = req.body;
        const report = await FarmReport.create({
            problemType,
            description,
            location,
            UserId: req.user.id
        });
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting farm report' });
    }
};

exports.getUserReports = async (req, res) => {
    try {
        const reports = await FarmReport.findAll({
            where: { UserId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching farm reports' });
    }
};

// Admin Fetchers
exports.getAllConsultations = async (req, res) => {
    try {
        const consultations = await Consultation.findAll({
            include: [{ model: User, attributes: ['username'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(consultations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching consultations' });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await FarmReport.findAll({
            include: [{ model: User, attributes: ['username'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports' });
    }
};
// Admin Actions
exports.updateConsultation = async (req, res) => {
    try {
        const { status, adminResponse, linkedResourceIds, linkedPostIds } = req.body;
        const consultation = await Consultation.findByPk(req.params.id);

        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        await consultation.update({
            status,
            adminResponse,
            linkedResourceIds,
            linkedPostIds
        });

        res.json(consultation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating consultation' });
    }
};

exports.updateReport = async (req, res) => {
    try {
        const { status, adminResponse, linkedResourceIds, linkedPostIds } = req.body;
        const report = await FarmReport.findByPk(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        await report.update({
            status,
            adminResponse,
            linkedResourceIds,
            linkedPostIds
        });

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error updating report' });
    }
};
