const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content, image, tags, category, status, featured } = req.body;
        const post = await Post.create({
            title,
            content,
            image,
            tags,
            category,
            status,
            featured,
            author: req.user.username
        });
        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { title, content, image, tags, category, status, featured } = req.body;
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.update({
            title, content, image, tags, category, status, featured
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await post.destroy();
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
