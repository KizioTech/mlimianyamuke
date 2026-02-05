const {
    User, Farmer, Post, Comment, Consultation, FarmReport, Resource, Contact, Crop, Testimonial, Analytics
} = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// --- ANALYTICS & STATS ---

// Public Stats for Home Page
exports.getPublicStats = async (req, res) => {
    try {
        const farmersCount = await Farmer.count();
        const cropsCount = await Crop.count();
        const postsCount = await Post.count({ where: { status: 'published' } });

        // Mocking "Happy Farmers" as total farmers for now, or based on resolved reports
        const resolvedReports = await FarmReport.count({ where: { status: 'resolved' } });

        res.json({
            farmers: farmersCount,
            crops: cropsCount,
            posts: postsCount,
            impact: resolvedReports * 5 // Mock multiplier for "Lives Impacted" or similar
        });
    } catch (error) {
        console.error('Error fetching public stats:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

// Admin Dashboard Analytics
exports.getAdminAnalytics = async (req, res) => {
    try {
        // Basic Counts
        const totalFarmers = await Farmer.count();
        const newFarmersThisMonth = await Farmer.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setDate(1)) // 1st of this month
                }
            }
        }).catch(err => {
            console.error('Error counting new farmers:', err);
            return 0;
        });

        // Web Traffic (Last 30 Days)
        const traffic = await Analytics.findAll({
            limit: 30,
            order: [['day', 'DESC']]
        });

        // Post Performance (Top 5 viewed/commented) - simplified to just comments for now
        const topPosts = await Post.findAll({
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'commentCount']
                ]
            },
            include: [{
                model: Comment,
                attributes: []
            }],
            group: ['Post.id'],
            order: [[sequelize.literal('commentCount'), 'DESC']],
            limit: 5
        });

        res.json({
            farmers: {
                total: totalFarmers,
                new: newFarmersThisMonth
            },
            traffic,
            topPosts
        });
    } catch (error) {
        console.error('Error fetching admin analytics:', error);
        // Return valid empty structure to prevent frontend crash
        res.json({
            farmers: { total: 0, new: 0 },
            traffic: [],
            topPosts: []
        });
    }
};

// Track Page View (called from frontend)
exports.trackPageView = async (req, res) => {
    try {
        const { path } = req.body;
        const today = new Date().toISOString().split('T')[0];

        const [record, created] = await Analytics.findOrCreate({
            where: { path, day: today },
            defaults: { visits: 1 }
        });

        if (!created) {
            await record.increment('visits');
        }

        res.json({ success: true });
    } catch (error) {
        // Fail silently avoids breaking frontend
        console.error('Analytics error:', error);
        res.json({ success: false });
    }
};

// --- TESTIMONIALS ---

exports.getTestimonials = async (req, res) => {
    try {
        // Public gets featured, Admin gets all? Or just one endpoint for now
        const testimonials = await Testimonial.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching testimonials' });
    }
};

exports.getFeaturedTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll({
            where: { featured: true },
            limit: 3,
            order: [['createdAt', 'DESC']]
        });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching featured testimonials' });
    }
};

exports.createTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.create(req.body);
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Error creating testimonial' });
    }
};

exports.deleteTestimonial = async (req, res) => {
    try {
        await Testimonial.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Testimonial deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting testimonial' });
    }
};

exports.updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByPk(req.params.id);
        if (!testimonial) return res.status(404).json({ message: 'Not Found' });

        await testimonial.update(req.body);
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Error updating testimonial' });
    }
};

// --- FARMER MANAGEMENT ---

exports.getFarmerDetails = async (req, res) => {
    try {
        const farmer = await Farmer.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['username', 'email'] }
            ]
        });

        if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

        // Fetch related data manually or via includes if associations exist
        // Assuming associations exist or manual fetching
        const crops = await Crop.findAll({ where: { UserId: farmer.UserId } });
        const reports = await FarmReport.findAll({ where: { UserId: farmer.UserId } });
        const consultations = await Consultation.findAll({ where: { UserId: farmer.UserId } });

        res.json({
            profile: farmer,
            crops,
            reports,
            consultations
        });
    } catch (error) {
        console.error('Error fetching farmer details:', error);
        res.status(500).json({ message: 'Error fetching farmer details' });
    }
};

exports.sendMessageToFarmer = async (req, res) => {
    try {
        const { message, type } = req.body; // type: 'sms', 'email', 'notification'
        // Mock sending message
        console.log(`Sending ${type} to Farmer ${req.params.id}: ${message}`);

        // In real app, integrate Twilio/SendGrid here

        res.json({ success: true, message: 'Message queued successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message' });
    }
};
