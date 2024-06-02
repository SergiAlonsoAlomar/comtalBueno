const { User, Post, Friendship, Comment, PostLike, CommentLike } = require('../models');
const { Op } = require('sequelize');

const toggleCommentLike = async (req, res) => {
    // const { commentId } = req.params;
    // const { username } = req.body;

    // try {
    //     const existingLike = await CommentLike.findOne({ where: { comment_id: commentId, username } });
    //     if (existingLike) {
    //         await existingLike.destroy();
    //         res.status(200).json({ message: 'Like removed' });
    //     } else {
    //         await CommentLike.create({ comment_id: commentId, username });
    //         res.status(201).json({ message: 'Like added' });
    //     }
    // } catch (error) {
    //     console.error('Error toggling comment like:', error);
    //     res.status(500).json({ error: 'Internal server error' });
    // }

    const { commentId } = req.params;
    const { username } = req.body;
    try {
        const existingLike = await CommentLike.findOne({ where: { comment_id: commentId, username } });
        if (existingLike) {
            await existingLike.destroy();
            res.status(200).json({ message: 'Like removed' });
        } else {
            await CommentLike.create({ comment_id: commentId, username });
            res.status(201).json({ message: 'Like added' });
        }
    } catch (error) {
        console.error('Error toggling comment like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCommentLikes = async (req, res) => {
    // const { commentId } = req.params;

    // try {
    //     const likes = await CommentLike.findAll({ where: { comment_id: commentId } });
    //     res.status(200).json(likes);
    // } catch (error) {
    //     console.error('Error getting comment likes:', error);
    //     res.status(500).json({ error: 'Internal server error' });
    // }

    const { commentId } = req.params;
    try {
        const likes = await CommentLike.findAll({ where: { comment_id: commentId } });
        res.status(200).json(likes);
    } catch (error) {
        console.error('Error fetching comment likes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    toggleCommentLike,
    getCommentLikes
};
